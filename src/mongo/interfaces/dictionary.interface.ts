import { Document } from "mongoose";

export interface IDictionary {
  type: string;
  idValue: number;
  value: string;
}

export interface IDictionaryDocument extends IDictionary, Document {}