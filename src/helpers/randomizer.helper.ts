/**
 * General method for randomizing
 * @param min Minimum Value
 * @param max Maximum Value
 * @returns 
 */
export const randomize = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Tries out taming a monster
 * @param tamingChance Taming Chance
 */
export const tryTame = (tamingChance: number): boolean => {
  const successRate = randomize(0, 100);

  return tamingChance >= successRate;
}