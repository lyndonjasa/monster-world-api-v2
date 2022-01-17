import { hash, genSalt } from 'bcrypt'
import config from '../shared/config';
import { sign, verify } from 'jsonwebtoken'

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

/**
 * Sign and Generate a Token
 * @param id user id
 * @returns jwt
 */
export async function getToken(id: string): Promise<string> {
  const token = sign({ _id: id }, config.secretKey, { expiresIn: config.tokenExpiry });

  return token
}

/**
 * Verify the token
 * @param token the JWT Token
 * @returns token details
 */
export async function verifyToken(token: string): Promise<any> {
  const data = verify(token, config.secretKey);

  return data
}