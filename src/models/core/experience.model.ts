import { IExperience } from "../../mongo/interfaces";

export class ExperienceModel implements IExperience {
  level: number;
  min: number;
  max: number;
}