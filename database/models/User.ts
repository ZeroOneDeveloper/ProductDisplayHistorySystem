import { Schema, model, models } from 'mongoose';

import IUser from './types/IUser';

const UserSchema = new Schema<IUser>({
  _id: {
    type: Number,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  }
}, {
  versionKey: false,
});

export default models.users || model("users", UserSchema);