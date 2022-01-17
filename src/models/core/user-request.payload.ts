import { Request } from "express";
import { IUserDocument } from "../../mongo/interfaces/user.interface";

export interface IUserRequestPayload extends Request {
  user: IUserDocument
};