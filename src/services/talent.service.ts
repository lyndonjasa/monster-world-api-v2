import { Types } from "mongoose";
import { parseCategory, parseTalentType } from "../helpers/talent.helper";
import { TalentModel } from "../models/core/talent.model";
import { BackdoorTalentRequest, UploadTalentRequest } from "../models/requests";
import { ITalentDocument } from "../mongo/interfaces/talent.interface";
import { DetailedMonster, Talent } from "../mongo/models";

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
export async function uploadTalents(request: UploadTalentRequest[]): Promise<ITalentDocument[]> {
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

    const result = await Talent.insertMany(talents);

    return result
  } catch (error) {
    session.abortTransaction();

    throw error
  } finally {
    session.endSession();
  }
}

/**
 * Backdoor for Adding Talent Points
 * @param request 
 */
export async function addTalentPoints(request: BackdoorTalentRequest): Promise<void> {
  try {
    const monsterIds = request.monsters.map(m => new Types.ObjectId(m));
    await DetailedMonster.updateMany({ _id: { $in: monsterIds } }, { $inc: { talentPoints: request.points } })
  } catch (error) {
    throw error
  }
}