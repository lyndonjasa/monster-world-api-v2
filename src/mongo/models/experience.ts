import { model, Schema } from "mongoose";
import { IExperienceDocument } from "../interfaces/experience.interface";

const schema = new Schema({
  level: Number,
  minRange: Number,
  maxRange: Number
})

const Experience = model<IExperienceDocument>('Experience', schema, 'experiences');

export default Experience;