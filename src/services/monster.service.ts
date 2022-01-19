import { Types } from "mongoose";
import { convertToDetailedMonsterResponse } from "../helpers/monster.helper";
import { convertToNumberElement } from "../helpers/skill.helper";
import { MonsterModel } from "../models/core/monster.model";
import { UploadMonsterRequest } from "../models/requests/upload-monster.request";
import { UploadSpriteRequest } from "../models/requests/upload-sprite.request";
import { DetailedMonsterResponse } from "../models/responses/detailed-monster.response";
import { StarterGroupResponse } from "../models/responses/starter-group.response";
import { IDetailedMonster, IDetailedMonsterDocument } from "../mongo/interfaces";
import { IMonsterDocument } from "../mongo/interfaces/monster.interface";
import { DetailedMonster } from "../mongo/models";
import Monster from "../mongo/models/monster";
import Skill from "../mongo/models/skill";
import { EvolutionEnum, starterGroups } from "../shared/constants";

/**
 * Get All Monsters
 * @returns Monster Array
 */
export async function getMonsters(): Promise<IMonsterDocument[]> {
  try {
    const monsters = await Monster.find().populate('skills');

    return monsters
  } catch (error) {
    throw error
  }
}

/**
 * Get Monster By Id
 * @param id Monster Id
 * @returns Monster
 */
export async function getMonster(id: string): Promise<IMonsterDocument> {
  try {
    const monster = await Monster.findById(id).populate('skills');

    return monster
  } catch (error) {
    throw error
  }
}
 
/**
 * Upload Monsters base data
 * @param request Monster data
 */
export async function uploadMonsters(request: UploadMonsterRequest[]): Promise<IMonsterDocument[]> {
  const session = await Monster.startSession();
  session.startTransaction();

  try {
    await Monster.deleteMany();

    const allSkills = await Skill.find();

    const monsters: MonsterModel[] = [];
    request.forEach(r => {
      const skills = allSkills.filter(s => r.skills.includes(s.name)).map(s => s.id)

      const monster: MonsterModel = {
        baseStats: r.stats,
        element: convertToNumberElement(r.element),
        name: r.name,
        skills: skills,
        stage: r.stage,
        statGain: r.gains
      }

      if (r.evolution !== '') {
        monster.evolution = r.evolution
      }

      monsters.push(monster);
    });

    const result = await Monster.insertMany(monsters);

    return result
  } catch (error) {
    session.abortTransaction();

    throw error
  } finally {
    session.endSession();
  }
}

/**
 * Upload Sprites and Update Monster Data
 */
export async function uploadMonsterSprites(request: UploadSpriteRequest[]): Promise<IMonsterDocument[]> {
  const session = await Monster.startSession();
  session.startTransaction();

  try {
    const monsters = await Monster.find();
    monsters.forEach(async (m) => {
      const relatedMonster = request.find(r => r.name === m.name);

      m.sprite = {
        attack: relatedMonster.attack,
        dead: relatedMonster.dead,
        dimensions: {
          height: relatedMonster.dimensions.height,
          scale: relatedMonster.scale,
          width: relatedMonster.dimensions.width
        },
        hit: relatedMonster.hit,
        idle: relatedMonster.idle,
        name: relatedMonster.name,
        ultimate: relatedMonster.ultimate,
        win: relatedMonster.win
      }

      await m.save();
    })

    return monsters;
  } catch (error) {
    session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Get Monster Starter Group
 */
export async function getStarterGroups(): Promise<StarterGroupResponse[]> {
  try {
    const rookies = await Monster.find({ stage: EvolutionEnum.ROOKIE })
                            .select('name element -_id');

    const groups: StarterGroupResponse[] = [];
    starterGroups.forEach(g => {
      const group: StarterGroupResponse = new StarterGroupResponse();
      group.group = g.group;
      group.monsters = []

      g.monsters.forEach(m => {
        group.monsters.push(rookies.find(r => r.name === m));
      })

      groups.push(group);
    })

    return groups;
  } catch (error) {
    throw error
  }
}

/**
 * Add Requested Monsters to Account
 * @param accountId Account Id
 * @param request request monster ids
 */
export async function addMonsterToAccount(accountId: string, request: string[]): Promise<IDetailedMonsterDocument[]> {
  try {
    // base monster model
    const baseMonster: IDetailedMonster = {
      accountId: new Types.ObjectId(accountId),
      currentExp: 0,
      level: 1,
      talentPoints: 1,
      talents: [],
      cardBonus: 0
    }

    const ids = request.map(r => new Types.ObjectId(r));
    const monsterDocuments = await Monster.find({ _id: { $in: ids } })

    const monsters: IDetailedMonster[] = [];
    request.forEach(r => {
      const document = monsterDocuments.find(d => d.id == r)
      monsters.push({
        ...baseMonster,
        monster: document._id
      });
    })

    const result = await DetailedMonster.insertMany(monsters);
    
    return result;
  } catch (error) {
    throw error
  }
}

/**
 * Fetches all monsters owned by the account
 * @param accountId Account Id
 */
export async function getAccountMonsters(accountId: string): Promise<DetailedMonsterResponse[]> {
  try {
    const id = new Types.ObjectId(accountId);

    const documents = await DetailedMonster.find({ accountId: id })
                            .populate('monster', '-evolution -__v -skills -sprite');

    const monsters = documents.map(d => convertToDetailedMonsterResponse(d))

    return monsters;
  } catch (error) {
    throw error
  }
}