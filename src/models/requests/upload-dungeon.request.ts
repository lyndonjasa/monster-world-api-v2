import { IDungeonEncounter } from "../../mongo/interfaces/dungeon.interface";

export class UploadDungeonRequest {
  name: string;
  recommendedLevel: number;
  minEnemySpawn: number;
  maxEnemySpawn: number;
  encounters: IDungeonEncounter[];
}