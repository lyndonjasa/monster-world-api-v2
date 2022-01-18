import { IMonster } from "../../mongo/interfaces/monster.interface";

export class StarterGroupResponse {
  group: number;
  monsters: IMonster[];
}