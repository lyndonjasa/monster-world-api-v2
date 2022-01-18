import express from 'express'
import { CreateAccountRequest } from '../models/requests';
import { createAccount, getAccount, getAccountParty } from '../services/account.service';

const AccountRouter = express.Router();

/**
 * Retrieve the account associated to the id
 */
AccountRouter.get('/accounts/:id', async (req, res) => {
  try {
    const accountId = req.params.id
    const account = await getAccount(accountId);

    if (!account) {
      res.status(404).send()
    } else {
      res.send(account);
    }
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Retrieve the account associated to the id
 */
 AccountRouter.get('/accounts/:id/party', async (req, res) => {
  try {
    const accountId = req.params.id
    const account = await getAccountParty(accountId);

    if (!account) {
      res.status(404).send()
    } else {
      res.send(account);
    }
  } catch (error) {
    res.status(500).send(error);
  }
})

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