import { StatsModel } from "../models/core";
import { IStats } from "../mongo/interfaces";
import { EvolutionEnum, TalentEnum } from "../shared/constants";

/**
 * Recalculate actual stats based on level and talents
 * @param baseStats Base Stats
 * @param statGains Stat Gains
 * @param currentLevel Current Level
 * @param talents Talents
 */
export function calculateStats(baseStats: IStats, 
  statGains: IStats, 
  currentLevel: number, 
  talents: string[],
  cardBonus: number,
  stage: EvolutionEnum): StatsModel {
  // get stats according to level
    const finalStats: StatsModel = {
      critDamage: baseStats.critDamage,
      critRate: realignStats(baseStats, statGains, currentLevel, 'critRate'),
      defense: realignStats(baseStats, statGains, currentLevel, 'defense'),
      health: realignStats(baseStats, statGains, currentLevel, 'health'),
      healthRegen: 10,
      mana: realignStats(baseStats, statGains, currentLevel, 'mana'),
      manaRegen: 10,
      offense: realignStats(baseStats, statGains, currentLevel, 'offense'),
      speed: realignStats(baseStats, statGains, currentLevel, 'speed')
    }

    // card bonus calculation
    if (stage === EvolutionEnum.ULTIMATE || stage === EvolutionEnum.ULTRA) {
      // 25 bonus points for Ultra, otherwise 15
      const baseBonusValue = stage === EvolutionEnum.ULTRA ? 25: 15;
      const bonusValuesArray = [...Array(cardBonus + 1).keys()]
      const cardSummation = bonusValuesArray.reduce((partial_sum, a) => partial_sum + a, 0)
      const totalStatBonus = cardSummation * baseBonusValue;

      finalStats.critRate += (totalStatBonus / 10);
      finalStats.defense += totalStatBonus;
      finalStats.health += totalStatBonus * 10;
      finalStats.mana += totalStatBonus;
      finalStats.offense += totalStatBonus;
      finalStats.speed += totalStatBonus;
    }

    if (talents.length > 0) {
      applyTalentBonuses(finalStats, talents);
    }

    // reassign maxMana and maxHealth
    finalStats.maxHealth = finalStats.health;
    finalStats.maxMana = finalStats.mana;

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
  return Math.floor(base[property] + (gain[property] * (level - 1)))
}

/**
 * Apply Talent Bonuses to Current Stats
 * @param stats current stats
 * @param talents current monster talents
 */
const applyTalentBonuses = (stats: StatsModel, talents: string[]) => {

  // Stat talents calculation
  // Offense Talents
  if (talents.includes(TalentEnum.EMPOWER)) {
    stats.offense += 10
  }
  if (talents.includes(TalentEnum.BERSERKER)) {
    stats.critRate += 10
  }
  if (talents.includes(TalentEnum.RAGE)) {
    stats.critDamage += 25
  }
  if (talents.includes(TalentEnum.FURY)) {
    stats.offense += (stats.offense * 0.2)
  }

  // Health Talents
  if (talents.includes(TalentEnum.RESOLUTE)) {
    stats.health += 100
  }
  if (talents.includes(TalentEnum.BLESSING)) {
    stats.healthRegen += 10
  }
  if (talents.includes(TalentEnum.INVIGORATE)) {
    stats.health += (stats.health * 0.2)
  }

  // Mana Talents
  if (talents.includes(TalentEnum.FLOW)) {
    stats.mana += 100
  }
  if (talents.includes(TalentEnum.CHAKRA)) {
    stats.manaRegen += 10
  }
  if (talents.includes(TalentEnum.ENERGIZE)) {
    stats.mana += (stats.mana * 0.2)
  }

  // Defense Talents
  if (talents.includes(TalentEnum.WILL)) {
    stats.defense += 10
  }
  if (talents.includes(TalentEnum.FORTITUDE)) {
    stats.defense += (stats.defense * 0.2)
  }

  // Speed Talents
  if (talents.includes(TalentEnum.HASTE)) {
    stats.speed += 10
  }
  if (talents.includes(TalentEnum.FLASH)) {
    stats.speed += (stats.speed * 0.2)
  }
}