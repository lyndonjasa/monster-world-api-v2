import { AccountModel } from "../models/core/account.model";
import { CreateAccountRequest } from "../models/requests";
import { CreateAccountResponse } from "../models/responses";
import { IAccountDocument, IDetailedMonster } from "../mongo/interfaces";
import { Account, DetailedMonster, Monster } from "../mongo/models";
import config from "../shared/config";
import { evolutionStages, starterGroups } from "../shared/constants";

/**
 * Get Account Details by Id
 * @param id Account Id
 */
export async function getAccount(id: string): Promise<IAccountDocument> {
  try {
    const account = await Account.findById(id)
                          .populate('party')
                          .populate({
                            path: 'party',
                            populate: {
                              path: 'monster'
                            }
                          });

    return account
  } catch (error) {
    throw error
  }
}

/**
 * Retrieve the account's current party
 * @param id Account Id
 */
export async function getAccountParty(id: string): Promise<IAccountDocument> {
  try {
    const account = await Account.findById(id)
                          .populate('party')
                          .populate({
                            path: 'party',
                            populate: {
                              path: 'monster'
                            }
                          })
                          .select('party');

    return account
  } catch (error) {
    throw error
  }
}

/**
 * Creates an Account with three starter monsters
 * @param request the request object
 * @returns the response containing the account id
 */
export async function createAccount(request: CreateAccountRequest): Promise<CreateAccountResponse> {
  const session = await Account.startSession();
  session.startTransaction();

  try {
    debugger
    const usedSession = config.environment === 'production' ? session : null

    const accounts = await Account.find({ userId: request.userId }).count();
    if (accounts >= 3) {
      throw 'User has maximized account pool'
    }

    // check for existing accounts with the same name
    const accountExists = await Account.findOne({ accountName: request.accountName });
    if (accountExists) {
      throw 'Account Name is already taken'
    }

    // get the rookie group from the request
    const rookies = starterGroups.find(sg => sg.group === request.rookieGroup);

    // base account model
    const account: AccountModel = {
      accountName: request.accountName,
      currency: 0,
      unlockedMonsters: rookies.monsters.map(m => m),
      userId: request.userId,
    }

    // save the base account
    const savedAccount = new Account(account);
    await savedAccount.save({ session: usedSession });

    // base monster model
    const baseMonster: IDetailedMonster = {
      accountId: savedAccount.id,
      currentExp: 0,
      level: 1,
      talentPoints: 1,
      talents: []
    }

    // get monter details of the selected group
    const monsterDocuments = await Monster.find({ stage: evolutionStages.ROOKIE, name: { $in: rookies.monsters.map(m => m) } });

    const selectedMonsters: IDetailedMonster[] = [];
    monsterDocuments.forEach(md => {
      selectedMonsters.push({
        ...baseMonster,
        monster: md.id
      });
    })

    const savedMonsters = await DetailedMonster.insertMany(selectedMonsters, { session: usedSession });

    await Account.updateOne({ _id: savedAccount._id }, { $set: { party: savedMonsters.map(sm => sm._id) } }, { session: usedSession } )

    return {
      accountId: savedAccount.id
    }
  } catch (error) {
    session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
}