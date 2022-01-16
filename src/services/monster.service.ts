import { convertToNumberElement } from "../helpers/skill.helper";
import { MonsterModel } from "../models/core/monster.model";
import { UploadMonsterRequest } from "../models/requests/upload-monster.request";
import { IMonsterDocument } from "../mongo/interfaces/monster.interface";
import Monster from "../mongo/models/monster";
import Skill from "../mongo/models/skill";

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