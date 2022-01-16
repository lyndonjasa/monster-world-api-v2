import { IItem } from "../../mongo/interfaces/item.interface";

export class ItemModel implements IItem {
  name: string;
  description: string;
  cost: number;
  type: string;
  tameRate?: { rookie: number; champion: number; ultimate: number; mega: number; ultra: number; };
}