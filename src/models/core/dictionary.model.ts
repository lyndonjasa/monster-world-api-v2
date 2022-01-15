import { IDictionary } from "../../mongo/interfaces/dictionary.interface";

export class DictionaryModel implements IDictionary {
  type: string;
  idValue: number;
  value: string;
}