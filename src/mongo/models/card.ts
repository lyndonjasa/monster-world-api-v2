import { model, Schema } from "mongoose";
import { ICardDocument } from "../interfaces";

const schema = new Schema({
  monsterName: {
    type: String,
    index: true
  },
  quantity: Number
})

const Card = model<ICardDocument>('Card', schema, 'cards');

export default Card;