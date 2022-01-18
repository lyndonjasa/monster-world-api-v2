import { model, Schema, Types } from "mongoose";
import { IDetailedMonsterDocument } from "../interfaces";

const schema = new Schema({
  level: Number,
  currentExp: Number,
  talents: [String],
  monster: {
    type: Types.ObjectId,
    ref: 'Monster'
  }
})

const DetailedMonster = model<IDetailedMonsterDocument>('DetailedMonster', schema, 'detailed-monsters');

export default DetailedMonster;