import { convertToNumberBuff, convertToNumberBuffInstance, convertToNumberElement, convertToNumberTarget, convertToNumberType } from "../helpers/skill.helper";
import { SkillModel } from "../models/core/skill.model";
import { UploadSkillRequest } from "../models/requests/upload-skill.request";
import Skill from "../mongo/models/skill"

/**
 * Lists down all skills
 * @returns 
 */
export const getSkills = async () => {
  try {
    return await Skill.find({});
  } catch (error) {
    throw error
  }
}

/**
 * Uploads skills to the database
 * @param request UploadSkillRequest[]
 */
export const uploadSkills = async (request: UploadSkillRequest[]) => {
  const skills: SkillModel[] = [];

  request.forEach(r => {
    const skill: SkillModel = {
      cost: r.cost,
      ignoreDefense: Boolean(r.ignoreDefense),
      name: r.skill,
      power: r.power,
      skillElement: convertToNumberElement(r.element),
      skillTarget: convertToNumberTarget(r.target),
      skillType: convertToNumberType(r.type)
    }

    const penalty: { damagePercentage: number, target: number } = {
      damagePercentage: r.penalty.damage * 100,
      target: convertToNumberTarget(r.penalty.target)
    }

    // add penalty if percentage is not 0
    if (penalty.damagePercentage !== 0) {
      skill.penalty = penalty;
    }

    // if status has a target, add status to skill
    if (r.status.target !== '') {
      skill.status = {
        buff: convertToNumberBuff(r.status.effect),
        chance: r.status.chance * 100,
        duration: r.status.turns,
        statusInstance: convertToNumberBuffInstance(r.status.instance),
        target: convertToNumberTarget(r.status.target)
      }
    }

    skills.push(skill);
  });

  const session = await Skill.startSession();
  session.startTransaction();

  try {
    await Skill.deleteMany();

    const result = await Skill.insertMany(skills);

    return result;
  } catch (error) {
    session.abortTransaction();

    throw error
  } finally {
    session.endSession();
  }
}