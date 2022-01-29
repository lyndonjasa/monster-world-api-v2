import { Types } from "mongoose";
import { throwError } from "../helpers/error.helper";
import { tryTame } from "../helpers/randomizer.helper";
import { getBonusCatchRate } from "../helpers/stat.helper";
import { TameActionRequest, WinBattleRequest } from "../models/requests";
import { ErrorResponse, TameActionResponse, WinBattleResponse } from "../models/responses";
import { IMonsterDocument } from "../mongo/interfaces";
import { Account, DetailedMonster, Evolution, Item, Monster } from "../mongo/models";
import config from "../shared/config";
import { getAccountParty } from "./account.service";
import { addMonsterToAccount } from "./monster.service";

/**
 * Try and Tame Monster
 * @param request Tame Parameters
 */
export async function tameMonster(request: TameActionRequest): Promise<TameActionResponse> {
  const session = await Account.startSession();
  session.startTransaction();

  try {
    const usedSession = config.environment === 'production' ? session : null;

    // find and validate account
    const account = await Account.findById(request.accountId);
    if (!account) {
      throw { errorCode: 404, errorMessage: 'Account not found' } as ErrorResponse
    }

    // validate if account has the item
    const accountItems = account.inventory.map(i => i.toString());
    if (!accountItems.some(ai => ai === request.itemId)) {
      throwError(400, 'Invalid Item Id');
    }

    // validate if item on request is a taming item
    const relatedItem = await Item.findById(request.itemId);
    if (!relatedItem.tameRate) {
      throwError(400, 'Invalid taming item');
    }

    // validate monster Id
    const requestedMonster = await Monster.findById(request.monsterId);
    if (!requestedMonster) {
      throwError(400, 'Invalid Monster Id');
    }

    // update the new item collection 
    const selectedItemBatch = accountItems.filter(a => a === request.itemId);
    const remainingItems = accountItems.filter(a => a !== request.itemId);
    selectedItemBatch.pop();

    const newItemCollection = [ ...selectedItemBatch, ...remainingItems ].map(i => new Types.ObjectId(i))
    await Account.findByIdAndUpdate(request.accountId, { $set: { inventory: newItemCollection } }, { session: usedSession })

    const evolution = await Evolution.findOne({ name: requestedMonster.stage })

    const response = new TameActionResponse();
    response.success = false;

    // get the computed catch rate
    const catchRate = evolution.catchRate + relatedItem.tameRate[requestedMonster.stage.toLowerCase()] + getBonusCatchRate(account.unlockedMonsters.length);
    const success = tryTame(catchRate);

    if (success) {
      response.success = true;

      const tamedMonster = await addMonsterToAccount(request.accountId, [request.monsterId]);
      response.detailedMonsterId = tamedMonster[0].id
    }

    return response;
  } catch (error) {
    session.abortTransaction();

    throw error
  } finally {
    session.endSession();
  }
}

/**
 * Returns the Exp and Currency rewards
 * @param request Battle Session
 */
export async function winBattle(request: WinBattleRequest): Promise<WinBattleResponse> {
  try {
    const { accountId, sessionId } = request;

    // get current account party
    const party = await getAccountParty(accountId);

    // get monsters from session
    const enemies = await DetailedMonster.find({ accountId: new Types.ObjectId(sessionId) }).populate('monster')
    if (!enemies || enemies.length === 0) {
      throwError(404, 'Session Not Found')
    }

    // get enemy stages 
    const enemyStages = enemies.map(e => (e.monster as IMonsterDocument).stage).filter((value, index, self) => self.indexOf(value) === index)
    const evolutions = await Evolution.find({ name: { $in: enemyStages } });

    // calculate total exp and total currency drops
    let totalCurrency = 0;
    let totalExp = 0;
    enemies.forEach(e => {
      const evolution = evolutions.find(ev => ev.name === (e.monster as IMonsterDocument).stage)

      totalCurrency += evolution.currency.base + (evolution.currency.increment * (e.level - 1))
      totalExp += evolution.baseExp * e.level
    })

    const distributedExp = Math.floor(totalExp / party.length)
    const response: WinBattleResponse = {
      changes: [],
      currencyDrop: totalCurrency,
      distributedExp
    }

    return response;
  } catch (error) {
    throw error
  }
}