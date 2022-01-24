import { Document, Types } from "mongoose";
import { IAccountDocument } from ".";

export interface ICard {
  monsterName: string;
  quantity: number;
}

export interface ICardInventory {
  account: string | IAccountDocument | Types.ObjectId,
  cards: ICard[]
}

export interface ICardInventoryDocument extends ICardInventory, Document {};