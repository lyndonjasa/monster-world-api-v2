import { Types } from "mongoose";
import { ItemModel } from "../models/core/item.model";
import { BuyItemRequest } from "../models/requests";
import { UploadItemRequest } from "../models/requests/upload-item.request";
import { BuyItemResponse, ErrorResponse, ItemResponse } from "../models/responses";
import { IItemDocument } from "../mongo/interfaces/item.interface";
import { Account } from "../mongo/models";
import Item from "../mongo/models/item";

/**
 * Get All Items
 * @returns Items array
 */
export async function getItems(): Promise<IItemDocument[]> {
  try {
    const items = await Item.find();

    return items;
  } catch (error) {
    throw error
  }
}

/**
 * Upload and Conver Items
 * @param request Array of Items
 */
export async function uploadItems(request: UploadItemRequest[]): Promise<IItemDocument[]> {
  const session = await Item.startSession();
  session.startTransaction();
  
  try {
    await Item.deleteMany();

    const items: ItemModel[] = [];
    request.forEach(r => {
      const item: ItemModel = {
        cost: r.cost,
        description: r.description,
        name: r.name,
        type: r.type
      }

      if (r.type === 'taming') {
        item.tameRate = {
          champion: r.rate.champion,
          mega: r.rate.mega,
          rookie: r.rate.rookie,
          ultimate: r.rate.ultimate,
          ultra: r.rate.ultra
        }
      }

      items.push(item);
    })

    const result = await Item.insertMany(items);

    return result;
  } catch (error) {
    session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Buy Items for the Account
 * @param request Items to Buy
 */
export async function buyItems(request: BuyItemRequest): Promise<BuyItemResponse> {
  try {
    const account = await Account.findById(request.accountId);
    if (!account) {
      throw { errorCode: 404, errorMessage: 'Account not found' } as ErrorResponse
    }

    const itemIds = request.items.map(i => new Types.ObjectId(i.itemId));
    const requestedItems = await Item.find({ _id: { $in: itemIds } });

    // validate account currency
    const totalRequiredAmount = requestedItems.map(ri => ri.cost).reduce((a, b) => a + b, 0);
    if (totalRequiredAmount > account.currency) {
      throw { errorCode: 400, errorMessage: 'Account does not have enough currency' } as ErrorResponse
    }

    // check if there is an invalid item on the request
    const itemDifference = itemIds.filter(i => !requestedItems.map(ri => ri._id).includes(i))
    if (itemDifference.length > 0) {
      throw { errorCode: 500, errorMessage: 'Unknown Item Found on request' } as ErrorResponse
    }

    // TODO: add updating of account here

    const itemResponses: ItemResponse[] = [];
    request.items.forEach(i => {
      const relatedDocument = requestedItems.find(ri => ri.id == i.itemId)

      itemResponses.push({
        item: relatedDocument.name,
        quantity: i.quantity
      });
    })

    return {
      accountId: request.accountId,
      items: itemResponses
    }
  } catch (error) {
    throw error
  }
}