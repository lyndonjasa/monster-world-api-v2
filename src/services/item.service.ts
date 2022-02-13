import { Types } from "mongoose";
import { InventoryItemModel } from "../models/core";
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

    // check if there is an invalid item on the request
    const itemDifference = itemIds.filter(i => !requestedItems.map(ri => ri.id).includes(i.toString()))
    if (itemDifference.length > 0) {
      throw { errorCode: 500, errorMessage: 'Unknown Item Found on request' } as ErrorResponse
    }

    const itemResponses: ItemResponse[] = [];
    const inventoryItemIds: Types.ObjectId[] = [];

    let totalRequestedAmount = 0;

    request.items.forEach(i => {
      const relatedDocument = requestedItems.find(ri => ri.id == i.itemId)
      totalRequestedAmount += relatedDocument.cost * i.quantity

      itemResponses.push({
        item: relatedDocument.name,
        quantity: i.quantity
      });

      for (let index = 0; index < i.quantity; index++) {
        inventoryItemIds.push(new Types.ObjectId(i.itemId));
      }
    })
    
    // validate account currency
    if (totalRequestedAmount > account.currency) {
      throw { errorCode: 400, errorMessage: 'Account currency insufficient' } as ErrorResponse
    }

    await Account.updateOne({ _id: new Types.ObjectId(request.accountId) }, 
                              {
                                $inc: {
                                  currency: -totalRequestedAmount
                                },
                                $push: {
                                  inventory: {
                                    $each: inventoryItemIds
                                  }
                                }
                              })

    return {
      accountId: request.accountId,
      items: itemResponses
    }
  } catch (error) {
    throw error
  }
}

/**
 * Get Inventory Items related to the Account
 * @param accountId Account Id
 */
export async function getAccountInventory(accountId: string): Promise<ItemResponse[]> {
  try {
    const id = new Types.ObjectId(accountId)

    const aggregationQuery = [
      { // match stage
        $match: {
          _id: id
        },
      },
      { // projection stage
        $project: {
          inventory: 1,
          _id: 0
        }
      },
      { // unwind
        $unwind: "$inventory"
      },
      { // group
        $group: {
          _id: "$inventory",
          count: { $sum: 1 }
        }
      }
    ]

    const inventoryItems: InventoryItemModel[] = await Account.aggregate(aggregationQuery);
    const itemDocuments = await Item.find({ _id: { $in: inventoryItems.map(ii => ii._id) } });

    const inventory: ItemResponse[] = [];
    inventoryItems.forEach(ii => {
      const itemDocument = itemDocuments.find(i => i._id.toString() == ii._id.toString())

      inventory.push({
        item: itemDocument.name,
        itemId: itemDocument.id,
        quantity: ii.count,
        type: itemDocument.type,
        description: itemDocument.description
      });
    })

    return inventory;
  } catch (error) {
    throw error
  }
}