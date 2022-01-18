import { Document } from "mongoose";
import { IDetailedMonsterDocument } from ".";

export interface IAccount {
  userId: string;
  accountName: string;
  currency: number;
  unlockedMonsters: string[];
  party?: IDetailedMonsterDocument[] | string[]; 
}

export interface IAccountDocument extends IAccount, Document {}