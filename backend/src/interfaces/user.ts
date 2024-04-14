import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  emailChangedAt: Date;
  password: string;
  passwordConfirm: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'guest' | 'manager';
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordResetAt?: Date;
}

export interface IUserWithNoCredential
  extends Omit<IUser, 'password' | 'passwordConfirm'> {
  password?: string;
  passwordConfirm?: string;
}

export interface IMongoUser extends IUser {
  _id: Types.ObjectId;
}
