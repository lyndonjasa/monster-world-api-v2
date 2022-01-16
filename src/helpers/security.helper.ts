import { hash, genSalt } from 'bcrypt'
import config from '../shared/config';

/**
 * Hashes a password
 * @param password string
 * @returns hashed password value
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const hashValue = await hash(password, salt);

  return hashValue;
}

/**
 * Generate Password Salt
 * @returns Password Salt
 */
export async function generateSalt(): Promise<string> {
  return await genSalt(config.passwordSalt)
}