import { model, Schema, Types } from "mongoose";
import { IDetailedMonsterDocument } from "../interfaces";

const schema = new Schema({
  accountId: {
    type: Types.ObjectId,
    ref: 'Account'
  },
  level: Number,
  currentExp: Number,
  talents: [String],
  talentPoints: Number,
  monster: {
    type: Types.ObjectId,
    ref: 'Monster'
  },
  cardBonus: Number
})

const DetailedMonster = model<IDetailedMonsterDocument>('DetailedMonster', schema, 'detailed-monsters');

export default DetailedMonster;