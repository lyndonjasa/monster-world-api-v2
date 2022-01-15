import { Document } from "mongoose";

export interface IEvolution {
  name: string;
  currency: {
    base: number;
    increment: number;
  }
  baseExp: number;
  baseLevel: number;
}

export interface IEvolutionDocument extends IEvolution, Document {}