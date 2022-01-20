import { IEvolution } from "../../mongo/interfaces/evolution.interface";

export class EvolutionModel implements IEvolution {
  catchRate: number;
  cardPrerequisite: number;
  maxCardBonus: number;
  name: string;
  currency: { 
    base: number; 
    increment: number; 
  }
  baseExp: number;
  levelCap: number;
}