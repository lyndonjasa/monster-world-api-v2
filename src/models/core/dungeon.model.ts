import { IDungeon, IDungeonEncounter } from "../../mongo/interfaces/dungeon.interface";

export class DungeonModel implements IDungeon {
  name: string;
  level: number;
  minSpawn: number;
  maxSpawn: number;
  encounters: IDungeonEncounter[];
}