import { model, Schema } from 'mongoose'
import { ISkillDocument } from '../interfaces/skill.interface';

const schema = new Schema({
  name: String,
  cost: Number,
  power: Number,
  skillType: Number,
  ignoreDefense: Boolean,
  skillTarget: Number,
  skillElement: Number,
  penalty: {
    damagePercentage: Number,
    target: Number,
  },
  status: {
    duration: Number,
    statusInstance: Number,
    target: Number,
    buff: Number,
    chance: Number
  }
})

const Skill = model<ISkillDocument>('Skill', schema, 'skills');

export default Skill;