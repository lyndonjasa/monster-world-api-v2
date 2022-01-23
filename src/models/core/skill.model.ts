import { ISkill } from "../../mongo/interfaces/skill.interface";

export class SkillModel implements ISkill {
  name: string;
  cost: number;
  power: number;
  skillType: number;
  ignoreDefense: boolean;
  skillTarget: number;
  skillElement: number;
  description: string;
  penalty?: {
    damagePercentage: number;
    target: number;
  };
  status?: {
    duration: number;
    statusInstance: number;
    target: number;
    buff: number;
    chance: number
  }
}