import { model, Schema } from "mongoose";
import { IUserDocument } from "../interfaces/user.interface";

const schema = new Schema({
  username: {
    type: String,
    index: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String,
  email: {
    type: String,
    required: true
  },
  createdDate: Date,
  firstName: String,
  lastName: String
})

const User = model<IUserDocument>('User', schema, 'users')

export default User;