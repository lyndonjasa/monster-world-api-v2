import express from 'express'
import { sendError } from '../helpers/error.helper';
import { ErrorResponse } from '../models/responses';

const EventRouter = express.Router();

/**
 * Try and Tame a Monster using an Item
 */
EventRouter.post('/events/tame', async (req, res) => {
  try {
    throw { errorCode: 400, errorMessage: 'invalid object' } as ErrorResponse
  } catch (error) {
    sendError(res, error);
  }
})

export default EventRouter;