import { model, Schema } from 'mongoose'
import { IDictionaryDocument } from '../interfaces/dictionary.interface'

const schema = new Schema({
  type: {
    type: String,
    index: true
  },
  idValue: Number,
  value: String
})

const Dictionary = model<IDictionaryDocument>('Dictionary', schema, 'dictionaries');

export default Dictionary;