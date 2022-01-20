import { Document } from "mongoose";

export interface IEvolution {
  name: string;
  currency: {
    base: number;
    increment: number;
  }
  baseExp: number;
  levelCap: number;
  catchRate: number;
  cardPrerequisite: number;
  maxCardBonus: number;
}

export interface IEvolutionDocument extends IEvolution, Document {}