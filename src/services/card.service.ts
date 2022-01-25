import { Types } from "mongoose"
import { throwError } from "../helpers/error.helper"
import { ICardInventoryDocument, IMonsterDocument } from "../mongo/interfaces";
import { CardInventory, DetailedMonster } from "../mongo/models"
import config from "../shared/config";
import { getAccountParty } from "./account.service";

/**
 * Converts the Monster to Card
 * @param accountId Account Id
 * @param monsterId Monster Id
 */
export async function convertToCard(accountId: string, monsterId: string): Promise<ICardInventoryDocument> {
  const session = await DetailedMonster.startSession();
  session.startTransaction();

  try {
    const usedSession = config.environment === 'production' ? session : null;

    const detailedMonster = await DetailedMonster
                                .findOne({ accountId: new Types.ObjectId(accountId), _id: new Types.ObjectId(monsterId) })
                                .populate('monster')
    if (!detailedMonster) {
      throwError(404, 'Monster not found');
    }

    const currentParty = await getAccountParty(accountId);
    if (currentParty.map(cp => cp._id).includes(detailedMonster.id.toString())) {
      throwError(400, 'Cannot convert a party member to card')
    }
    
    const monster = detailedMonster.monster as IMonsterDocument
    let cardInventory = await CardInventory.findOne({ account: new Types.ObjectId(accountId) })
    if (!cardInventory) {
      cardInventory = new CardInventory({
        account: new Types.ObjectId(accountId),
        cards: []
      })
    }
    
    const requestedCard = cardInventory.cards.find(c => c.monsterName === monster.name);
    if (requestedCard) {
      requestedCard.quantity += 1;
    } else {
      cardInventory.cards.push({
        monsterName: monster.name,
        quantity: 1
      })
    }

    await DetailedMonster.findByIdAndDelete(monsterId, { session: usedSession });
    await cardInventory.save({ session: usedSession });

    return cardInventory
  } catch (error) {
    throw error
  }
}

/**
 * Return Card Inventory of the Account
 * @param accountId Account Id
 */
export async function getAccountCards(accountId: string): Promise<ICardInventoryDocument> {
  try {
    const inventory = await CardInventory
                        .findOne({ account: new Types.ObjectId(accountId) })
                        .select('-_id -cards._id -__v')
    if (!inventory) {
      throwError(404, 'Inventory not found')
    }

    return inventory
  } catch (error) {
    throw error
  }
}

/**
 * Get Card Quantity of a specific card
 * @param accountId Account Id
 * @param monster Monster Name
 */
export async function getCard(accountId: string, monster: string): Promise<ICardInventoryDocument> {
  try {
    const cardInventory = await CardInventory
                              .findOne({ account: new Types.ObjectId(accountId), 'cards.monsterName': monster }, 
                              {
                                cards: { $elemMatch: { monsterName: monster } }
                              })

    if (!cardInventory) {
      throwError(404, 'Monster Card not found')
    }

    return cardInventory
  } catch (error) {
    throw error
  }
}