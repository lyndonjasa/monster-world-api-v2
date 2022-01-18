import { ISkill, ISprite, IStats } from "../../mongo/interfaces";

export class DetailedMonsterResponse {
  _id: string;
  level: number;
  currentExp: number;
  expToLevel: number;
  talents: string[];
  name: string;
  stats: IStats & {
    maxMana: number;
    maxHealth: number;
  }
  sprite: ISprite;
  element: number;
  skills: ISkill[];
}