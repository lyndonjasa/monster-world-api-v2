import { IStats } from "../../mongo/interfaces";

export class StatsModel implements IStats {
  health: number;
  mana: number;
  offense: number;
  defense: number;
  speed: number;
  critRate: number;
  critDamage: number;
  maxMana?: number;
  maxHealth?: number;
  healthRegen: number;
  manaRegen: number;
}