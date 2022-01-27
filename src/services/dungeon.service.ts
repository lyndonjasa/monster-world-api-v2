import { throwError } from "../helpers/error.helper";
import { convertToDetailedMonsterResponse } from "../helpers/monster.helper";
import { randomizeSpawn } from "../helpers/randomizer.helper";
import { DungeonModel } from "../models/core/dungeon.model";
import { UploadDungeonRequest } from "../models/requests/upload-dungeon.request";
import { DetailedMonsterResponse } from "../models/responses";
import { IDetailedMonster, IDetailedMonsterDocument } from "../mongo/interfaces";
import { IDungeonDocument } from "../mongo/interfaces/dungeon.interface";
import { DetailedMonster, Monster } from "../mongo/models";
import Dungeon from "../mongo/models/dungeon";

/**
 * Get All Dungeons
 */
export async function getDungeons(): Promise<IDungeonDocument[]> {
  try {
    const dungeons = await Dungeon.find();

    return dungeons
  } catch (error) {
    throw error
  }
}

/**
 * Get Dungeon by Id
 * @param id dungeon id
 */
export async function getDungeonById(id: string): Promise<IDungeonDocument> {
  try {
    const dungeon = await Dungeon.findById(id)

    return dungeon
  } catch (error) {
    throw error
  }
}

/**
 * Produces a random set of enemies and level
 * @param dungeonId 
 */
export async function produceEnemies(dungeonId: string): Promise<DetailedMonsterResponse[]> {
  try {
    const dungeonDetails = await Dungeon.findById(dungeonId);
    if (!dungeonDetails) {
      throwError(404, 'Dungeon not found')
    }

    const { minSpawn, maxSpawn, encounters } = dungeonDetails
    const spawns = randomizeSpawn(encounters, minSpawn, maxSpawn);

    const monsterNames = spawns.map(s => s.name);
    const monsterDocuments = await Monster.find({ name: { $in: monsterNames } }).populate('skills', '-_id -__v -description')

    const enemies: IDetailedMonsterDocument[] = [];
    spawns.forEach(s => {
      const detailedMonster: IDetailedMonster = {
        level: s.level,
        accountId: '',
        currentExp: 0,
        talents: [],
        talentPoints: 0,
        cardBonus: 0
      }

      detailedMonster.monster = monsterDocuments.find(md => md.name === s.name)
      const result = new DetailedMonster(detailedMonster);

      enemies.push(result);
    })

    return enemies.map(e => convertToDetailedMonsterResponse(e))
  } catch (error) {
    throw error
  }
}

/**
 * Uploads and Converts Dungeon data
 * @param request Dungeons
 */
export async function uploadDungeons(request: UploadDungeonRequest[]): Promise<IDungeonDocument[]> {
  const session = await Dungeon.startSession();
  session.startTransaction();

  try {
    await Dungeon.deleteMany();

    const dungeons: DungeonModel[] = [];
    request.forEach(r => {
      dungeons.push({
        encounters: r.encounters,
        level: r.recommendedLevel,
        maxSpawn: r.maxEnemySpawn,
        minSpawn: r.minEnemySpawn,
        name: r.name
      });
    })

    const result = await Dungeon.insertMany(dungeons);

    return result;
  } catch (error) {
    session.abortTransaction();

    throw error
  } finally {
    session.endSession();
  }
}