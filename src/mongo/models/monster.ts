import { model, Schema, Types } from "mongoose";
import { IMonsterDocument } from '../interfaces/monster.interface'

const schema = new Schema({
  name: String,
  baseStats: {
    health: Number,
    mana: Number,
    offense: Number,
    defense: Number,
    speed: Number,
    critRate: Number,
    critDamage: Number
  },
  statGain: {
    health: Number,
    mana: Number,
    offense: Number,
    defense: Number,
    speed: Number,
    critRate: Number,
    critDamage: Number
  },
  element: Number,
  skills: [
    {
      type: Types.ObjectId,
      ref: 'Skill'
    }
  ],
  stage: String,
  evolution: String,
  sprite: {
    name: String,
    dimensions: {
      scale: Number,
      width: Number,
      height: Number
    },
    idle: {
      start: Number,
      end: Number,
      layer: Number,
      speed: Number
    },
    attack: {
      start: Number,
      end: Number,
      layer: Number,
      speed: Number
    },
    ultimate: {
      start: Number,
      end: Number,
      layer: Number,
      speed: Number
    },
    hit: {
      start: Number,
      end: Number,
      layer: Number,
      speed: Number
    },
    dead: {
      start: Number,
      end: Number,
      layer: Number,
      speed: Number
    },
    win: {
      start: Number,
      end: Number,
      layer: Number,
      speed: Number
    }
  }
})

const Monster = model<IMonsterDocument>('Monster', schema, 'monsters')

export default Monster;