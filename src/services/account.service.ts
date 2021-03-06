import { Types } from "mongoose";
import { throwError } from "../helpers/error.helper";
import { convertToDetailedMonsterResponse } from "../helpers/monster.helper";
import { AccountModel } from "../models/core/account.model";
import { CreateAccountRequest } from "../models/requests";
import { CreateAccountResponse, ErrorResponse } from "../models/responses";
import { DetailedMonsterResponse } from "../models/responses/detailed-monster.response";
import { IAccountDocument, IDetailedMonster, IDetailedMonsterDocument, IMonsterDocument, ISkill, ISkillDocument } from "../mongo/interfaces";
import { Account, CardInventory, DetailedMonster, Monster } from "../mongo/models";
import config from "../shared/config";
import { EvolutionEnum, starterGroups } from "../shared/constants";

/**
 * Get Account Details by Id
 * @param id Account Id
 */
export async function getAccount(id: string): Promise<IAccountDocument> {
  try {
    const account = await Account.findById(id)
                          .select('-__v -inventory')
                          .populate('party')
                          .populate({
                            path: 'party',
                            select: '-__v -accountId -talents -talentPoints',
                            populate: {
                              path: 'monster',
                              select: 'name element -_id'
                            }
                          });

    return account
  } catch (error) {
    throw error
  }
}

/**
 * Sets an Account to inactive
 * @param id 
 */
export async function deleteAccount(id: string): Promise<void> {
  try {
    await Account.findByIdAndUpdate(id, { $set: { isActive: false } });
  } catch (error) {
    throw error
  }
}

/**
 * backdoor functionality for adding 200k currency
 * @param id accountId
 */
export async function addCurrency(id: string): Promise<IAccountDocument> {
  try {
    const account = await Account.findById(id);
    if (!account) {
      throw { errorCode: 404, errorMessage: 'Account not found' } as ErrorResponse
    }

    account.currency += 200000;
    await account.save();

    return account;
  } catch (error) {
    throw error
  }
}

/**
 * Retrieve the account's current party
 * @param id Account Id
 */
export async function getAccountParty(id: string): Promise<DetailedMonsterResponse[]> {
  try {
    const account = await Account.findById(id)
                          .populate('party')
                          .populate({
                            path: 'party',
                            select: '-accountId -__v',
                            populate: {
                              path: 'monster',
                              select: '-evolution -__v',
                              populate: {
                                path: 'skills',
                                select: '-__v -_id'
                              }
                            }
                          })
                          .select('party');
    
    if (!account) {
      throwError(400, 'Account not found')
    }

    const monsterParty: DetailedMonsterResponse[] = [];
    (account.party as IDetailedMonsterDocument[]).forEach(dm => {
      const monster: DetailedMonsterResponse = convertToDetailedMonsterResponse(dm);

      monsterParty.push(monster);
    })

    return monsterParty
  } catch (error) {
    throw error
  }
}

/**
 * Switch Party Members
 */
export async function switchParty(accountId: string, monsterIds: string[]): Promise<DetailedMonsterResponse[]> {
  try {
    if (monsterIds.length > 3 || monsterIds.length === 0) {
      throwError(400, 'Valid Party Count ranges from 1 to 3')
    }

    const ids = monsterIds.map(id => new Types.ObjectId(id))

    const selectedMonsters = await DetailedMonster.find({ 
      accountId: new Types.ObjectId(accountId),
      _id: {
        $in: ids
      }
    });
    if (selectedMonsters.length != monsterIds.length) {
      throwError(400, 'Invalid Request, Missing/Duplicate Monster Ids')
    }

    await Account.findByIdAndUpdate(accountId, { $set: { party: ids } });

    return getAccountParty(accountId);
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
    const usedSession = config.environment === 'production' ? session : null

    const accounts = await Account.find({ userId: request.userId, isActive: true }).count();
    if (accounts >= 3) {
      throwError(400, 'User has maximized account pool')
    }

    // check for existing accounts with the same name
    const accountExists = await Account.findOne({ accountName: request.accountName });
    if (accountExists) {
      throwError(400, 'Account Name is already taken')
    }

    // get the rookie group from the request
    const rookies = starterGroups.find(sg => sg.group === request.rookieGroup);

    // base account model
    const account: AccountModel = {
      accountName: request.accountName,
      currency: 1000, // starting currency of 1000
      unlockedMonsters: rookies.monsters.map(m => m),
      userId: request.userId,
      inventory: [],
      isActive: true
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
      talents: [],
      cardBonus: 0
    }

    // get monter details of the selected group
    const monsterDocuments = await Monster.find({ stage: EvolutionEnum.ROOKIE, name: { $in: rookies.monsters.map(m => m) } });

    const selectedMonsters: IDetailedMonster[] = [];
    monsterDocuments.forEach(md => {
      selectedMonsters.push({
        ...baseMonster,
        monster: md.id
      });
    })

    const savedMonsters = await DetailedMonster.insertMany(selectedMonsters, { session: usedSession });

    await Account.updateOne({ _id: savedAccount._id }, { $set: { party: savedMonsters.map(sm => sm._id) } }, { session: usedSession } )

    // create a card inventory
    const cardInventory = new CardInventory({
      account: savedAccount._id,
      cards: []
    })

    await cardInventory.save({ session: usedSession })

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

/**
 * Get Details of a Monster owned by the Account
 * @param monsterId Monster Id
 * @param accountId Account Id
 */
export async function getAccountMonster(monsterId: string, accountId: string): Promise<DetailedMonsterResponse> {
  try {
    const monster = await DetailedMonster
                            .findOne({ _id: new Types.ObjectId(monsterId), accountId: new Types.ObjectId(accountId) })
                            .populate({
                              path: 'monster',
                              populate: {
                                path: 'skills',
                                select: '-_id -__v'
                              }
                            });
    if (!monster) {
      throwError(400, 'Monster not found');
    }

    return convertToDetailedMonsterResponse(monster);
  } catch (error) {
    throw error
  }
}