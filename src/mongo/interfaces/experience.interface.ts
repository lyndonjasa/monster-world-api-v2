import { Document } from "mongoose";

export interface IExperience {
  level: number;
  minRange: number;
  maxRange: number;
}

export interface IExperienceDocument extends IExperience, Document {};