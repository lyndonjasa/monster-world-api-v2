import { Document, Types } from "mongoose";
import { IMonsterDocument } from ".";

export interface IDetailedMonster {
  accountId: string | Types.ObjectId;
  level: number;
  currentExp: number;
  talents: string[];
  talentPoints: number;
  monster?: IMonsterDocument | Types.ObjectId;
}

export interface IDetailedMonsterDocument extends IDetailedMonster, Document {}