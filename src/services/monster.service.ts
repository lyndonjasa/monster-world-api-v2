import { convertToNumberElement } from "../helpers/skill.helper";
import { MonsterModel } from "../models/core/monster.model";
import { UploadMonsterRequest } from "../models/requests/upload-monster.request";
import { UploadSpriteRequest } from "../models/requests/upload-sprite.request";
import { IMonsterDocument } from "../mongo/interfaces/monster.interface";
import Monster from "../mongo/models/monster";
import Skill from "../mongo/models/skill";

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