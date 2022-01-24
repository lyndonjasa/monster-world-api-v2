import { model, Schema, SchemaTypes } from "mongoose";
import { ICardInventoryDocument } from "../interfaces";

const schema = new Schema({
  account: {
    type: SchemaTypes.ObjectId,
    ref: 'Account'
  },
  cards: [
    {
      monsterName: {
        type: String,
        index: true
      },
      quantity: Number
    }
  ]
})

const CardInventory = model<ICardInventoryDocument>('CardInventory', schema, 'card-inventory');

export default CardInventory;