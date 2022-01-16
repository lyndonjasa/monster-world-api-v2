import { model, Schema } from "mongoose";
import { IDungeonDocument } from "../interfaces/dungeon.interface";

const schema = new Schema({
  name: String,
  level: Number,
  minSpawn: Number,
  maxSpawn: Number,
  encounters: [
    {
      rate: Number,
      monster: String,
      minLevel: Number,
      maxLevel: Number
    }
  ]
})

const Dungeon = model<IDungeonDocument>('Dungeon', schema, 'dungeons');

export default Dungeon;