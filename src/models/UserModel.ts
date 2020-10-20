import {model, Schema, Document} from 'mongoose';

import generatePasswordHash from '../utils/generateHash';

export interface User extends Document {
  email: string
  password: string
  fullname: string
  username: string
  confirm_hash?: string
}

const UserSchema = new Schema({
  email: {
    unique: true,
    require: true,
    type: String
  },
  password: {
    require: true,
    type: String
  },
  fullname: {
    require: true,
    type: String
  },
  username: {
    unique: true,
    require: true,
    type: String
  }
});

UserSchema.pre<User>("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  user.password = await generatePasswordHash(user.password);
  user.confirm_hash = await generatePasswordHash(new Date().toString());
});

export const UserModel= model<User>('User', UserSchema);