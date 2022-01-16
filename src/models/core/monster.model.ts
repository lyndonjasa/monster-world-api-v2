import { IMonster, IStats } from "../../mongo/interfaces/monster.interface";
import { ISprite } from "../../mongo/interfaces/sprite.interface";

export class MonsterModel implements IMonster {
  name: string;
  baseStats: IStats;
  statGain: IStats;
  sprite?: ISprite;
  element: number;
  skills: string[];
  stage: string;
  evolution?: string;
}