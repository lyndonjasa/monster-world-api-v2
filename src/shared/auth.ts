import { NextFunction, Response } from "express";
import { validateToken } from "../helpers/security.helper";
import { IUserRequestPayload } from "../models/core/user-request.payload";
import { findUser } from "../services/user.service";

/**
 * Authentication Middleware
 */
export const auth = async (req: IUserRequestPayload, res: Response, next: NextFunction) => {
  try {
    const authToken = req.header('Authorization').replace('Bearer ', '');
    const decodedToken = await validateToken(authToken);

    const user = await findUser(decodedToken._id);
    if (!user) {
      throw new Error()
    }

    const currentTimeInSecs = new Date().getTime() / 1000;
    if (currentTimeInSecs > decodedToken.exp) {
      throw new Error()
    }

    req.user = user

    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized Access' });
  }
}