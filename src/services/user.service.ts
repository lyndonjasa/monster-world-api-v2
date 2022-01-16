import { CreateUserRequest } from "../models/requests/create-user.request";
import { IUser } from "../mongo/interfaces/user.interface";

export async function createUser(request: CreateUserRequest): Promise<void> {
  try {
    const user: IUser = {
      createdDate: 
    };

  } catch (error) {
    throw error
  }
}