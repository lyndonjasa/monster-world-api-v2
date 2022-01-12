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
      return 0; 
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
      throw 'unknown element'
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
      throw 'unknown type'
  }
}