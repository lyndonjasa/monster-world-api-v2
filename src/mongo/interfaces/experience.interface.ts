import { Document } from "mongoose";

export interface IExperience {
  level: number;
  min: number;
  max: number;
}

export interface IExperienceDocument extends IExperience, Document {};