import express from 'express'
import { sendError } from '../helpers/error.helper';
import { CreateAccountRequest, SearchMonsterRequest } from '../models/requests';
import { addCurrency, createAccount, getAccount, getAccountMonster, getAccountParty, switchParty } from '../services/account.service';
import { convertToCard, getAccountCards } from '../services/card.service';
import { getAccountInventory } from '../services/item.service';
import { addMonsterToAccount, applyCardBonus, evolveMonster, getAccountMonsters } from '../services/monster.service';
import { addTalents, resetTalents } from '../services/talent.service';

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

    res.send(account)
  } catch (error) {
    sendError(res, error)
  }
})

/**
 * Update Current Party of Account
 */
 AccountRouter.put('/accounts/:id/party', async (req, res) => {
  try {
    const accountId = req.params.id
    const monsterIds = req.body as string[]

    const account = await switchParty(accountId, monsterIds);

    res.send(account)
  } catch (error) {
    sendError(res, error)
  }
})

/**
 * Retrieve all monsters owned by the account
 */
 AccountRouter.post('/accounts/:id/monsters', async (req, res) => {
  try {
    const accountId = req.params.id
    const criteria = req.body as SearchMonsterRequest;
    const monsters = await getAccountMonsters(accountId, criteria);

    res.send(monsters);
  } catch (error) {
    sendError(res, error)
  }
})

/**
 * Retrieve a monster by its monster id
 */
 AccountRouter.get('/accounts/:id/monsters/:monsterId', async (req, res) => {
  try {
    const accountId = req.params.id
    const monsterId = req.params.monsterId
    const monster = await getAccountMonster(monsterId, accountId);

    res.send(monster);
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

/**
 * Retrive the Account Inventory
 */
AccountRouter.get('/accounts/:id/inventory', async (req, res) => {
  try {
    const accountId = req.params.id
    const inventory = await getAccountInventory(accountId);

    res.send(inventory);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Update the Monster's Talents
 */
AccountRouter.put('/accounts/:accountId/monsters/:monsterId/talents', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const monsterId = req.params.monsterId;
    const talents = req.body as string[];

    const monster = await addTalents(accountId, monsterId, talents);

    res.send(monster);
  } catch (error) {
    sendError(res, error);
  }
})

/**
 * Update the Monster's Talents
 */
AccountRouter.delete('/accounts/:accountId/monsters/:monsterId/talents', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const monsterId = req.params.monsterId;

    const result = await resetTalents(accountId, monsterId);

    res.send(result);
  } catch (error) {
    sendError(res, error);
  }
})

/**
 * Converts a Monster to a card
 */
AccountRouter.put('/accounts/:accountId/monsters/:monsterId/card', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const monsterId = req.params.monsterId;

    const result = await convertToCard(accountId, monsterId);

    res.send(result);
  } catch (error) {
    sendError(res, error);
  }
})

/**
 * Converts a Monster to a card
 */
 AccountRouter.put('/accounts/:accountId/monsters/:monsterId/evolve', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const monsterId = req.params.monsterId;

    const result = await evolveMonster(accountId, monsterId);

    res.send(result);
  } catch (error) {
    sendError(res, error);
  }
})

/**
 * Converts a Monster to a card
 */
 AccountRouter.put('/accounts/:accountId/monsters/:monsterId/bonus', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const monsterId = req.params.monsterId;

    const result = await applyCardBonus(accountId, monsterId);

    res.send(result);
  } catch (error) {
    sendError(res, error);
  }
})

/**
 * Get All Monster Cards Related to Account
 */
 AccountRouter.get('/accounts/:accountId/cards', async (req, res) => {
  try {
    const accountId = req.params.accountId;

    const result = await getAccountCards(accountId)

    res.send(result);
  } catch (error) {
    sendError(res, error);
  }
})

//#region BACKDOOR ROUTES

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

//#endregion BACKDOOR ROUTES


export default AccountRouter;