import { IStats } from "../../mongo/interfaces";

export class WinBattleResponse {
  distributedExp: number;
  currencyDrop: number;
  changes: StatChanges[];
}

export class StatChanges {
  name: string;
  previous: IStats;
  current: IStats;
}