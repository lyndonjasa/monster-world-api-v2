import { Types } from "mongoose";
import { throwError } from "../helpers/error.helper";
import { tryTame } from "../helpers/randomizer.helper";
import { getBonusCatchRate } from "../helpers/stat.helper";
import { TameActionRequest } from "../models/requests";
import { ErrorResponse, TameActionResponse } from "../models/responses";
import { Account, Evolution, Item, Monster } from "../mongo/models";
import config from "../shared/config";
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