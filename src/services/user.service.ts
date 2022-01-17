import { CreateUserRequest } from "../models/requests/create-user.request";
import { IUser } from "../mongo/interfaces/user.interface";
import moment from 'moment';
import { generateSalt, hashPassword } from "../helpers/security.helper";
import User from "../mongo/models/user";
import { LoginRequest } from "../models/requests/login.request";
import { ErrorResponse } from "../models/responses/error.response";

/**
 * Create a User
 * @param request user credentials
 */
export async function createUser(request: CreateUserRequest): Promise<void> {
  try {
    const userExists = await User.findOne({ $or: [
      { username: request.username },
      { email: request.email }
    ] })
    if (userExists) {
      throw { errorCode: 400, errorMessage: 'Username or Email is already used' } as ErrorResponse
    }

    const saltValue = await generateSalt();
    const hashedPassword = await hashPassword(request.password, saltValue);

    const user: IUser = {
      createdDate: moment().toDate(),
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      password: hashedPassword,
      salt: saltValue,
      username: request.username
    };

    const result = new User(user)
    await result.save();
  } catch (error) {
    throw error
  }
}

/**
 * Logins and returns the user id if successful
 * @param request user credentials
 */
export async function login(request: LoginRequest): Promise<{ userId: string }> {
  try {
    const username = request.username;

    const user = await User.findOne({ username: username });
    if (!user) {
      throw { code: 404, message: 'User not found' }
    }

    const hashedPassword = await hashPassword(request.password, user.salt);
    if (user.password !== hashedPassword) {
      throw { code: 404, message: 'User not found' }
    }

    return {
      userId: user.id 
    }
  } catch (error) {
    throw error
  }
}