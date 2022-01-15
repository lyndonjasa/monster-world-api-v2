import { IEvolution } from "../../mongo/interfaces/evolution.interface";

export class EvolutionModel implements IEvolution {
  name: string;
  currency: { 
    base: number; 
    increment: number; 
  }
  baseExp: number;
  baseLevel: number;
}