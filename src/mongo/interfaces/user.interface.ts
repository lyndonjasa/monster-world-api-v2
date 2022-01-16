import { Document } from "mongoose";

export interface IUser {
  username: string;
  password: string;
  email: string;
  createdDate: Date;
  firstName: string;
  lastName: string;
}

export interface IUserDocument extends IUser, Document {}