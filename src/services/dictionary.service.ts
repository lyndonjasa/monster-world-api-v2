import { DictionaryModel } from "../models/core/dictionary.model";
import { UploadDictionaryRequest } from "../models/requests/upload-dictionary.request";
import { IDictionaryDocument } from "../mongo/interfaces/dictionary.interface";
import Dictionary from "../mongo/models/dictionary";

/**
 * Get List of Values used by the application
 * @returns Dictionary Array
 */
export async function getDictionaries(): Promise<IDictionaryDocument[]> {
  try {
    const result = await Dictionary.find();

    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Get List of Values by type
 * @param type string
 */
export async function getDictionariesByType(dictionaryType: string): Promise<IDictionaryDocument[]> {
  try {
    const result = await Dictionary.find({ type: dictionaryType });

    return result
  } catch (error) {
    throw error
  }
}

/**
 * Upload List of Values to be used by the application
 * @param request Dictionary Values
 */
export async function uploadDictionaries(request: UploadDictionaryRequest[]): Promise<IDictionaryDocument[]> {
  const session = await Dictionary.startSession();
  session.startTransaction();

  try {
    await Dictionary.deleteMany();

    const dictionaries: DictionaryModel[] = [];
    request.forEach(r => {
      dictionaries.push({
        idValue: r.id,
        type: r.type,
        value: r.value
      });
    });

    const result = await Dictionary.insertMany(dictionaries);

    return result;
  } catch (error) {
    session.abortTransaction();

    throw error
  } finally {
    session.endSession();
  }
}