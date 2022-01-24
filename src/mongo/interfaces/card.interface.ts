import { Document } from "mongoose";

export interface ICard {
  monsterName: string;
  quantity: number;
}

export interface ICardDocument extends ICard, Document {};