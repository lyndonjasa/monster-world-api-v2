import { Document } from "mongoose";

export interface IDungeonEncounter {
  rate: number;
  monster: string;
  minLevel: number;
  maxLevel: number;
}

export interface IDungeon {
  name: string;
  level: number;
  minSpawn: number;
  maxSpawn: number;
  encounters: IDungeonEncounter[];
}

export interface IDungeonDocument extends IDungeon, Document {}