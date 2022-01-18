import { StatsModel } from "../models/core";
import { IStats } from "../mongo/interfaces";

/**
 * 
 * @param baseStats Base Stats
 * @param statGains Stat Gains
 * @param currentLevel Current Level
 * @param talents Talents
 */
export function calculateStats(baseStats: IStats, statGains: IStats, currentLevel: number, talents: string[]): StatsModel {
  const finalStats: StatsModel = {
    critDamage: baseStats.critDamage,
    critRate: realignStats(baseStats, statGains, currentLevel, 'critRate'),
    defense: realignStats(baseStats, statGains, currentLevel, 'defense'),
    health: realignStats(baseStats, statGains, currentLevel, 'health'),
    healthRegen: 10,
    mana: realignStats(baseStats, statGains, currentLevel, 'mana'),
    manaRegen: 10,
    maxHealth: realignStats(baseStats, statGains, currentLevel, 'health'),
    maxMana: realignStats(baseStats, statGains, currentLevel, 'mana'),
    offense: realignStats(baseStats, statGains, currentLevel, 'offense'),
    speed: realignStats(baseStats, statGains, currentLevel, 'speed')
  }

  // TODO: add talent calculation

  return finalStats;
}

/**
 * 
 * @param base base stat
 * @param gain stat gain per level
 * @param level current level
 * @returns 
 */
const realignStats = (base: IStats, gain: IStats, level: number, property: string) => {
  return base[property] + (gain[property] * (level - 1))
}