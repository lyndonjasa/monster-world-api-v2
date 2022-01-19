import express from 'express'
import { CreateAccountRequest } from '../models/requests';
import { addCurrency, createAccount, getAccount, getAccountParty } from '../services/account.service';
import { addMonsterToAccount, getAccountMonsters } from '../services/monster.service';

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
 * Retrieve the current monster pary associated to the id
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
 * Retrieve all monsters owned by the account
 */
 AccountRouter.get('/accounts/:id/monsters', async (req, res) => {
  try {
    const accountId = req.params.id
    const monsters = await getAccountMonsters(accountId);

    res.send(monsters);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Backdoor Route to add currency
 */
 AccountRouter.put('/accounts/:id/currency', async (req, res) => {
  try {
    const accountId = req.params.id
    const account = await addCurrency(accountId);

    res.send(account);
  } catch (error) {
    if (error.errorCode) {
      res.status(error.errorCode).send(error);
    } else {
      res.status(500).send(error);
    }
  }
})

/**
 * Backdoor route to add requested monsters
 */
 AccountRouter.put('/accounts/:id/monsters', async (req, res) => {
  try {
    const accountId = req.params.id
    const request = req.body as string[];

    const monsters = await addMonsterToAccount(accountId, request);

    res.send(monsters);
  } catch (error) {
    if (error.errorCode) {
      res.status(error.errorCode).send(error);
    } else {
      res.status(500).send(error);
    }
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