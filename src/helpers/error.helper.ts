import { Response } from "express";
import { ErrorResponse } from "../models/responses";

/**
 * Generic class for posting error
 * @param res Response Object
 * @param error Error Object
 */
export function sendError(res: Response, error: any): void {
  if (error.errorCode) {
    res.status(error.errorCode).send(error.errorMessage);
  } else {
    res.status(500).send(error);
  }
}

/**
 * Wrapper function for throwing error 
 * @param code Error Code
 * @param message Error Message
 */
export function throwError(errorCode: number, errorMessage: string): void {
  throw { errorCode, errorMessage } as ErrorResponse
}