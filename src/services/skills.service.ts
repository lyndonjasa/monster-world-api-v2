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