import { DungeonModel } from "../models/core/dungeon.model";
import { UploadDungeonRequest } from "../models/requests/upload-dungeon.request";
import { IDungeonDocument } from "../mongo/interfaces/dungeon.interface";
import Dungeon from "../mongo/models/dungeon";

/**
 * Uploads and Converts Dungeon data
 * @param request Dungeons
 */
export async function uploadDungeons(request: UploadDungeonRequest[]): Promise<IDungeonDocument[]> {
  const session = await Dungeon.startSession();
  session.startTransaction();

  try {
    await Dungeon.deleteMany();

    const dungeons: DungeonModel[] = [];
    request.forEach(r => {
      dungeons.push({
        encounters: r.encounters,
        level: r.recommendedLevel,
        maxSpawn: r.maxEnemySpawn,
        minSpawn: r.minEnemySpawn,
        name: r.name
      });
    })

    const result = await Dungeon.insertMany(dungeons);

    return result;
  } catch (error) {
    session.abortTransaction();

    throw error
  } finally {
    session.endSession();
  }
}