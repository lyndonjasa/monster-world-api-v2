import { ItemModel } from "../models/core/item.model";
import { UploadItemRequest } from "../models/requests/upload-item.request";
import { IItemDocument } from "../mongo/interfaces/item.interface";
import Item from "../mongo/models/item";

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