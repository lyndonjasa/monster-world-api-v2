import { DetailedMonsterResponse } from ".";

export class EnterDungeonResponse {
  sessionId: string;
  encounters: DetailedMonsterResponse[]
}