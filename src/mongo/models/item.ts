import { model, Schema } from "mongoose";
import { IItemDocument } from "../interfaces/item.interface";

const schema = new Schema({
  name: String,
  description: String,
  cost: Number,
  type: {
    type: String,
    index: true
  },
  tameRate: {
    rookie: Number,
    champion: Number,
    ultimate: Number,
    mega: Number,
    ultra: Number
  }
})

const Item = model<IItemDocument>('Item', schema, 'items')

export default Item;