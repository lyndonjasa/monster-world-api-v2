import { parseCategory, parseTalentType } from "../helpers/talent.helper";
import { TalentModel } from "../models/core/talent.model";
import { UploadTalentRequest } from "../models/requests/upload-talent.request";
import { ITalentDocument } from "../mongo/interfaces/talent.interface";
import Talent from "../mongo/models/talent"

/**
 * Get Talents available on the database
 * @returns Talents Array
 */
export async function getTalents(): Promise<ITalentDocument[]> {
  try {
    const talents = await Talent.find();
    
    return talents;
  } catch (error) {
    throw error
  }
}

/**
 * Uploads Talents to database
 * @param talents Talents Array
 */
export async function uploadTalents(request: UploadTalentRequest[]): Promise<void> {
  const session = await Talent.startSession();
  session.startTransaction();

  try {
    await Talent.deleteMany();

    const talents: TalentModel[] = [];
    request.forEach(r => {
      talents.push({
        name: r.name,
        description: r.description,
        category: parseCategory(r.category),
        type: parseTalentType(r.type),
        points: r.points
      });
    })

    await Talent.insertMany(talents);
  } catch (error) {
    session.abortTransaction();

    throw error
  } finally {
    session.endSession();
  }
}