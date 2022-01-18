import express from 'express'
import { CreateAccountRequest } from '../models/requests';
import { createAccount } from '../services/account.service';

const AccountRouter = express.Router();

/**
 * Create an account
 */
AccountRouter.post('/accounts', async (req, res) => {
  try {
    const request = req.body as CreateAccountRequest;
    const account = await createAccount(request);

    res.send(account);
  } catch (error) {
    res.status(500).send(error)
  }
});

export default AccountRouter;