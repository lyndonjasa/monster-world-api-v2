import { Response } from "express";

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