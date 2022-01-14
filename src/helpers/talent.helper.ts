/**
 * Parses Category string to its numerical value
 * @param category 
 * @returns number
 */
export function parseCategory(category: string): number {
  switch (category.toUpperCase()) {
    case 'OFFENSE':
      return 1;
    case 'HEALTH':
      return 2;
    case 'MANA':
      return 3;
    case 'DEFENSE':
      return 4;
    case 'SPEED':
      return 5;
    default:
      throw `unknown category: ${category}`
  }
}

/**
 * Parses Talent Type to its numerical value
 * @param type string
 * @returns number
 */
export function parseTalentType(type: string): number {
  switch (type.toUpperCase()) {
    case 'STAT':
      return 1;
    case 'BATTLE':
      return 2;
    default:
      throw `unknown talent type: ${type}`
  }
}