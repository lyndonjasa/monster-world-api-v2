import { model, Schema, Types } from "mongoose";
import { IAccountDocument } from "../interfaces";

const schema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User'
  },
  accountName: String,
  currency: Number,
  unlockedMonsters: [String],
  party: [
    {
      type: Types.ObjectId,
      ref: 'DetailedMonster'
    }
  ],
  inventory: [
    {
      type: Types.ObjectId,
      ref: 'Item'
    }
  ],
  isActive: Boolean
})

const Account = model<IAccountDocument>('Account', schema, 'accounts')

export default Account;