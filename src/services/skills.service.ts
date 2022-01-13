import { convertToNumberElement, convertToNumberTarget, convertToNumberType } from "../helpers/skill.helper";
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
export const uploadSkills = (request: UploadSkillRequest[]) => {
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

    skills.push(skill);
  });

  return skills;
}