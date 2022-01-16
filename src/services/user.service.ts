import { CreateUserRequest } from "../models/requests/create-user.request";
import { IUser } from "../mongo/interfaces/user.interface";
import moment from 'moment';
import { hashPassword } from "../helpers/security.helper";
import User from "../mongo/models/user";

/**
 * Create a User
 * @param request user credentials
 */
export async function createUser(request: CreateUserRequest): Promise<void> {
  try {
    const hashedPassword = await hashPassword(request.password);

    const user: IUser = {
      createdDate: moment().toDate(),
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      password: hashedPassword,
      username: request.username
    };

    const result = new User(user)
    await result.save();
  } catch (error) {
    throw error
  }
}