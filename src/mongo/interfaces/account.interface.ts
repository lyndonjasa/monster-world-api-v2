import { Document } from "mongoose";
import { IDetailedMonsterDocument, IItemDocument } from ".";

export interface IAccountItems {
  item: IItemDocument | string;
  quantity: number;
}

export interface IAccount {
  userId: string;
  accountName: string;
  currency: number;
  unlockedMonsters: string[];
  party?: IDetailedMonsterDocument[] | string[];
  inventory?: IAccountItems[];
}

export interface IAccountDocument extends IAccount, Document {}