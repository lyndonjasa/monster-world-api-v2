import { Document } from "mongoose";
import { IMonsterDocument } from ".";

export interface IDetailedMonster {
  level: number;
  currentExp: number;
  talents: string[];
  monster: IMonsterDocument;
}

export interface IDetailedMonsterDocument extends IDetailedMonster, Document {};