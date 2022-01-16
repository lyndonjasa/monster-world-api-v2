import { IStats } from "../../mongo/interfaces/monster.interface";


export class UploadMonsterRequest {
  name: string;
  stats: IStats;
  gains: IStats;
  element: string;
  skills: string[];
  stage: string;
  evolution: string;
}