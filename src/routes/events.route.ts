import express from 'express'
import { sendError } from '../helpers/error.helper';
import { TameActionRequest, WinBattleRequest } from '../models/requests';
import { tameMonster, winBattle } from '../services/event.service';

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

/**
 * End a Battle session
 */
 EventRouter.post('/events/win', async (req, res) => {
  try {
    const request = req.body as WinBattleRequest
    const response = await winBattle(request);

    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
})

export default EventRouter;