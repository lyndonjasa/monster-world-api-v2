import { model, Schema } from "mongoose";

const schema = new Schema({
  name: String,
  currency: {
    base: Number,
    increment: Number
  },
  baseExp: Number,
  baseLevel: Number
})

const Evolution = model('Evolution', schema, 'evolutions');

export default Evolution;