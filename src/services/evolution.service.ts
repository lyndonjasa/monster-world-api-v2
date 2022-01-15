import { EvolutionModel } from "../models/core/evolution.model";
import { UploadEvolutionRequest } from "../models/requests/upload-evolution.request";
import { IEvolutionDocument } from "../mongo/interfaces/evolution.interface";
import Evolution from "../mongo/models/evolution";

/**
 * Get All Evolution Data
 * @returns Evolution Array
 */
export async function getEvolutions(): Promise<IEvolutionDocument[]> {
  try {
    const evolutions = await Evolution.find();

    return evolutions
  } catch (error) {
    throw error
  }
}

/**
 * Uploads and Converts Evolution data
 * @param request Evolution for upload
 */
export async function uploadEvolutions(request: UploadEvolutionRequest[]): Promise<IEvolutionDocument[]> {
  const session = await Evolution.startSession();
  session.startTransaction();

  try {
    await Evolution.deleteMany();

    const evolutions: EvolutionModel[] = [];
    request.forEach(r => {
      evolutions.push({
        baseExp: r.exp,
        baseLevel: r.level,
        currency: {
          base: r.currency,
          increment: r.currencyIncrement
        },
        name: r.name
      });
    })

    const result = await Evolution.insertMany(evolutions);

    return result;
  } catch (error) {
    session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
}