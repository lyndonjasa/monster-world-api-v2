import { IMonsterDocument } from ".";

export interface IDetailedMonster {
  level: number;
  currentExp: number;
  talents: string[];
  monster?: IMonsterDocument;
}