/**
 * Starter Groups
 */
export const starterGroups = [
  {
    group: 1,
    monsters: [ 'Dorumon', 'Veemon', 'Betamon' ]
  },
  {
    group: 2,
    monsters: [ 'Patamon', 'Guilmon', 'Agumon' ]
  },
  {
    group: 3,
    monsters: [ 'Hackmon', 'Hawkmon', 'Gomamon' ]
  }
]

/**
 * Evolution Stages
 */
export enum EvolutionEnum {
  ROOKIE = 'Rookie',
  CHAMPION = 'Champion',
  ULTIMATE = 'Ultimate',
  MEGA = 'Mega',
  ULTRA = 'Ultra'
}

/**
 * Talents
 */
export enum TalentEnum {
  // offense
  EMPOWER = 'Empower',
  BERSERKER = 'Berserker',
  RAGE = 'Rage',
  FURY = 'Fury',
  WRATH = 'Wrath',
  // health
  RESOLUTE = 'Resolute',
  BLESSING = 'Blessing',
  VAMPIRISM = 'Vampirism',
  INVIGORATE = 'Invigorate',
  UNDYING = 'Undying',
  // mana
  FLOW = 'Flow',
  CHAKRA = 'Chakra',
  EFFICIENCY = 'Efficiency',
  ENERGIZE = 'Energize',
  LETHARGY = 'Lethargy',
  // defense
  WILL = 'Will',
  GUARD = 'Guard',
  PRIDE = 'Pride',
  FORTITUDE = 'Fortitude',
  RETALIATION = 'Retaliation',
  // speed
  HASTE = 'Haste',
  LIGHT_FOOTED = 'Light-Footed',
  ACCURACY = 'Accuracy',
  FLASH = 'Flash',
  INTRUDER = 'Intruder'
}