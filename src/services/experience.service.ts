import { ExperienceModel } from "../models/core";
import { UploadExperienceRequest } from "../models/requests";
import { IExperienceDocument } from "../mongo/interfaces";
import { Experience } from "../mongo/models";

/**
 * Upload Experience Table
 * @param request experience table values
 */
export async function uploadExperinceTable(request: UploadExperienceRequest[]): Promise<IExperienceDocument[]> {
  try {
    await Experience.deleteMany();

    const models: ExperienceModel[] = [];
    request.forEach(r => {
      models.push({
        level: r.level,
        max: r.maxRange,
        min: r.minRange
      })
    })

    const values = await Experience.insertMany(models);

    return values;
  } catch (error) {
    throw error
  }
}

/**
 * Get the whole Experience Table
 * @returns Experience Table
 */
export async function getExperienceTable(): Promise<IExperienceDocument[]> {
  try {
    const table = await Experience.find().select('-__v');

    return table;
  } catch (error) {
    throw error
  }
}