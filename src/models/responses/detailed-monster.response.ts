import { ISkill, ISprite } from "../../mongo/interfaces";
import { StatsModel } from "../core";

export class DetailedMonsterResponse {
  _id: string;
  level: number;
  currentExp: number;
  expToLevel: number;
  talents: string[];
  name: string;
  stats: StatsModel;
  sprite: ISprite;
  element: number;
  skills: ISkill[];
}