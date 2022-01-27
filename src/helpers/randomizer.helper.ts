import { SpawnModel } from "../models/core";
import { IDungeonEncounter } from "../mongo/interfaces";

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

/**
 * Randomize Spawned Monsters
 * @param encounters Possible Encounters
 * @param minSpawn Min Number of Spawns
 * @param maxSpawn Max Number of Spawns
 */
export const randomizeSpawn = (encounters: IDungeonEncounter[], minSpawn: number, maxSpawn: number): SpawnModel[] => {
  const spawns: SpawnModel[] = [];

  // get number of spawns
  const spawnCount = randomize(minSpawn, maxSpawn);

  // re-order encounter rate
  encounters.forEach((e, idx) => {
    if (idx !== 0) {
      e.rate += encounters[idx - 1].rate
    }
  })

  // loop thru number of spawns
  for (let index = 0; index < spawnCount; index++) {
    const spawnRoll = randomize(1, 100);

    // loop thru possible encounters by rate
    for (let e = 0; e < encounters.length; e++) {
      if (spawnRoll <= encounters[e].rate) {
        const randomLevel = randomize(encounters[e].minLevel, encounters[e].maxLevel)
        spawns.push({
          name: encounters[e].monster,
          level: randomLevel
        })

        break; // break inner loop
      }
    }
  }

  return spawns;
}