import { Document } from "mongoose";
import { IMonsterDocument } from ".";

export interface IAccount {
  userId: string;
  accountName: string;
  currency: number;
  unlockedMonsters: string[];
  party?: IMonsterDocument[]; 
}

export interface IAccountDocument extends IAccount, Document {}