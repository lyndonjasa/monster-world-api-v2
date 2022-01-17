import { CreateUserRequest } from "../models/requests/create-user.request";
import { IUser, IUserDocument } from "../mongo/interfaces/user.interface";
import moment from 'moment';
import { generateSalt, getToken, hashPassword } from "../helpers/security.helper";
import User from "../mongo/models/user";
import { LoginRequest } from "../models/requests/login.request";
import { ErrorResponse } from "../models/responses/error.response";
import { LoginResponse } from "../models/responses/login.response";

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
export async function login(request: LoginRequest): Promise<LoginResponse> {
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

    const jwt = await getToken(user.id);

    return {
      userId: user.id,
      authToken: jwt
    }
  } catch (error) {
    throw error
  }
}

/**
 * Find the user by its Id
 * @param id user id
 * @returns IUserDocument
 */
export async function findUser(id: string): Promise<IUserDocument> {
  try {
    const user = await User.findById(id);

    return user;
  } catch (error) {
    throw error
  }
}