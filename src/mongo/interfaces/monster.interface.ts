import { Document } from "mongoose";
import { ISprite } from "./sprite.interface";

export interface IStats {
  health: number;
  mana: number;
  offense: number;
  defense: number;
  speed: number;
  critRate: number;
  critDamage: number;
}

export interface IMonster {
  name: string;
  baseStats: IStats,
  statGain: IStats,
  sprite?: ISprite,
  element: number;
  skills: string[];
  stage: string;
  evolution?: string;
}

export interface IMonsterDocument extends IMonster, Document {}