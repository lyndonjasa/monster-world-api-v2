export class SkillModel {
  name: string;
  cost: number;
  power: number;
  skillType: number;
  ignoreDefense: boolean;
  skillTarget: number;
  skillElement: number;
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