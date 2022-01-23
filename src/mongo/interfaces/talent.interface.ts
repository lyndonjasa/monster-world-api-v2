import { Document } from "mongoose";

export interface ITalent {
  name: string;
  description: string;
  category: number;
  type: number;
  points: number;
  prerequisite?: string;
}

export interface ITalentDocument extends ITalent, Document {}