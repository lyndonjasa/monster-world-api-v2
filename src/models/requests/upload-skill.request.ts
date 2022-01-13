export class UploadSkillRequest {
  skill: string;
  element: string;
  cost: number;
  power: number;
  type: string;
  target: string;
  status: {
    effect: string;
    target: string;
    chance: number;
    turns: number;
    instance: number;
  }
  description: string;
  ignoreDefense: number;
  penalty: {
    damage: number;
    target: string;
  }
}