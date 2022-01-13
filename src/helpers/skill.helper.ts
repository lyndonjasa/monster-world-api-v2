/**
 * Convert from Target string value to Target number value
 * @param target string
 * @returns number
 */
export function convertToNumberTarget(target: string): number {

  switch (target.toUpperCase()) {
    case 'ENEMY':
      return 1;
    case 'ALL ENEMIES':
      return 2;
    case 'ALLY':
      return 3;
    case 'ALL ALLIES':
      return 4;
    case 'SELF':
      return 5;
    case 'OTHERS':
      return 6;
    default:
      throw `unknown target: ${target}`; 
  }
}

/**
 * Converts from Element string value to Element number value
 * @param element string
 * @returns number
 */
export function convertToNumberElement(element: string): number  {
  
  switch (element.toUpperCase()) {
    case 'NONELEMENTAL':
      return 0;
    case 'FIRE':
      return 1;
    case 'WIND':
      return 2;
    case 'ELECTRIC':
      return 3;
    case 'ROCK':
      return 4;
    case 'WATER':
      return 5;
    default:
      throw `unknown element: ${element}`
  }
}

/**
 * Converts from Type string value to Type number value
 * @param type string 
 * @returns number
 */
export function convertToNumberType(type: string): number {
  
  switch (type.toUpperCase()) {
    case 'DAMAGE':
      return 1;
    case 'BUFF':
      return 2;
    case 'HEAL':
      return 3;
    case 'SIGNATURE':
      return 4;
    default:
      throw `unknown type: ${type}`
  }
}

/**
 * Converts from Buff string value to Buff number value
 * @param buff string
 * @returns number
 */
export function convertToNumberBuff(buff: string): number {
  switch (buff.toUpperCase()) {
    case 'BURN':
      return 1;
    case  'WET':
      return 2;
    case 'BLIND':
      return 3;
    case 'STATIC':
      return 4;
    case 'STUN':
      return 5;
    case 'BOOST':
      return 6;
    case 'WELTGEIST':
      return 7;
    case 'BARRIER':
      return 8;
    case 'RAGE':
      return 9;
    case 'AGGRO':
      return 10;
    case 'COUNTER':
      return 11;
    case 'POWER DOWN':
      return 12;
    case 'DEFENSE DOWN':
      return 13;
    case 'SPEED UP':
      return 14;
    case 'SPEED DOWN':
      return 15;
    case 'DEFENSE UP':
      return 16;
    case 'SILENCE':
      return 17;
    case 'POWER UP':
      return 18;
    default:
      throw `unknown buff: ${buff}`
  }
}

/**
 * Converts from Buff Instance string value to Buff Instance number value
 * @param buffInstance string
 * @returns number
 */
export function convertToNumberBuffInstance(buffInstance: string): number {
  switch (buffInstance.toUpperCase()) {
    case 'PER TURN':
      return 1;
    case 'PER INSTANCE':
      return 2;
    default:
      throw `unknown buff instance: ${buffInstance}`
  }
}