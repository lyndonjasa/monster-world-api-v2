import { Schema, model } from "mongoose";
import { ITalent } from "../interfaces/talent.interface";

const schema = new Schema({
  name: String,
  description: String,
  category: Number,
  type: Number,
  points: Number
})

const Talent = model<ITalent>('Talent', schema, 'talents');

export default Talent;