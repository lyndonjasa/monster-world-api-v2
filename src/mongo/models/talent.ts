import { Schema, model } from "mongoose";
import { ITalentDocument } from "../interfaces/talent.interface";

const schema = new Schema({
  name: String,
  description: String,
  category: Number,
  type: Number,
  points: Number,
  prerequisite: String
})

const Talent = model<ITalentDocument>('Talent', schema, 'talents');

export default Talent;