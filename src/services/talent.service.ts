import { Types } from "mongoose";
import { throwError } from "../helpers/error.helper";
import { convertToDetailedMonsterResponse } from "../helpers/monster.helper";
import { parseCategory, parseTalentType } from "../helpers/talent.helper";
import { TalentModel } from "../models/core/talent.model";
import { BackdoorTalentRequest, UploadTalentRequest } from "../models/requests";
import { DetailedMonsterResponse } from "../models/responses";
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
        points: r.points,
        prerequisite: r.prerequisite.trim() !== '' ? r.prerequisite : undefined
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

/**
 * Add Talents for the Monster
 * @param accountId Account Id
 * @param monsterId Monster Id
 * @param requestedTalents Selected Talents 
 */
export async function addTalents(accountId: string, monsterId: string, requestedTalents: string[]): Promise<DetailedMonsterResponse> {
  try {
    const monster = await DetailedMonster
                          .findOne({ accountId: new Types.ObjectId(accountId), _id: new Types.ObjectId(monsterId) })
                          .populate('monster', '-_id -__v -skills')
    if (!monster) {
      throwError(404, 'Monster not found');
    }

    const currentTalents = monster.talents;
    // get talents that aren't existing from the monster
    const newTalents = requestedTalents.filter(t => !currentTalents.includes(t));
    const expectedResult = [ ...currentTalents, ...newTalents ];

    const talentDocuments = await Talent.find({ name: { $in: newTalents } })

    // validate amount of talent points
    const requiredPoints = talentDocuments.map(td => td.points).reduce((a, b) => a + b, 0);
    if (requiredPoints > monster.talentPoints) {
      throwError(400, 'Insufficient Talent Points')
    }

    talentDocuments.forEach(td => {
      // if a talent has a prerequisite and isn't found on the request
      if (td.prerequisite && !expectedResult.some(er => er == td.prerequisite)) {
        throwError(400, `Required prerequisite talent ${td.prerequisite} for ${td.name}`);
      } else {
        monster.talents.push(td.name)
        monster.talentPoints -= td.points
      }
    })

    await monster.save();

    return convertToDetailedMonsterResponse(monster);
  } catch (error) {
    throw error
  }
}