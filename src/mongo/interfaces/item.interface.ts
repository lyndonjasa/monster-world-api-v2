import { Document } from "mongoose";

export interface IItem {
  name: string;
  description: string;
  cost: number;
  type: string;
  tameRate?: {
    rookie: number;
    champion: number;
    ultimate: number;
    mega: number;
    ultra: number
  }
}

export interface IItemDocument extends IItem, Document {}