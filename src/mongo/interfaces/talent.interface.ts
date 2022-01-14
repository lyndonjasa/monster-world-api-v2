import { Document } from "mongoose";

export interface ITalent extends Document {
  name: string;
  description: string;
  category: number;
  type: number;
  points: number;
}