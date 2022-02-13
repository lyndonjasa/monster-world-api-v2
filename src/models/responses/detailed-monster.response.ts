import { ISkill, ISprite } from "../../mongo/interfaces";
import { StatsModel } from "../core";

export class DetailedMonsterResponse {
  _id: string;
  level: number;
  currentExp: number;
  expToLevel: number;
  talents: string[];
  talentPoints: number;
  name: string;
  computedName: string;
  stats: StatsModel;
  sprite: ISprite;
  element: number;
  skills: ISkill[];
  stage: string;
  evolution?: string;
}