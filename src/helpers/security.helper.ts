import { hash } from 'bcrypt'

/**
 * Hashes a password
 * @param password string
 * @returns hashed password value
 */
export async function hashPassword(password: string): Promise<string> {
  const hashValue = await hash(password, 8);

  return hashValue;
}