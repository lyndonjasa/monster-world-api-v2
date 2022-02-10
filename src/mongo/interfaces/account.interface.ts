import { Document } from "mongoose";
import { IDetailedMonsterDocument, IItemDocument } from ".";

export interface IAccount {
  userId: string;
  accountName: string;
  currency: number;
  unlockedMonsters: string[];
  party?: IDetailedMonsterDocument[] | string[];
  inventory?: IItemDocument[] | string[];
  isActive: boolean;
}

export interface IAccountDocument extends IAccount, Document {}