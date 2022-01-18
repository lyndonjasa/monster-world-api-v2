import { Document } from "mongoose";
import { IMonsterDocument } from ".";

export interface IDetailedMonster {
  accountId: string;
  level: number;
  currentExp: number;
  talents: string[];
  talentPoints: number;
  monster?: IMonsterDocument | string;
}

export interface IDetailedMonsterDocument extends IDetailedMonster, Document {}