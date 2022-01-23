import express from 'express'
import { sendError } from '../helpers/error.helper';
import { TameActionRequest } from '../models/requests';
import { tameMonster } from '../services/event.service';

const EventRouter = express.Router();

/**
 * Try and Tame a Monster using an Item
 */
EventRouter.post('/events/tame', async (req, res) => {
  try {
    const request = req.body as TameActionRequest;
    const result = await tameMonster(request);

    res.send(result);
  } catch (error) {
    sendError(res, error);
  }
})

export default EventRouter;