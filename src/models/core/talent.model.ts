import { ITalent } from "../../mongo/interfaces/talent.interface"; 

export class TalentModel implements ITalent {
  name: string;
  description: string;
  category: number;
  type: number;
  points: number;
  prerequisite?: string;
}