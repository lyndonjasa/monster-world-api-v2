import { model, Schema } from "mongoose";
import { IEvolutionDocument } from "../interfaces/evolution.interface";

const schema = new Schema({
  name: String,
  currency: {
    base: Number,
    increment: Number
  },
  baseExp: Number,
  baseLevel: Number,
  catchRate: Number,
  cardPrerequisite: Number,
  maxCardBonus: Number
})

const Evolution = model<IEvolutionDocument>('Evolution', schema, 'evolutions');

export default Evolution;