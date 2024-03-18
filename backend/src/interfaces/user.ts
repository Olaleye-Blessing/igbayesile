import { Types } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'guest' | 'manager';
}

export interface IUserWithNoCredential
  extends Omit<IUser, 'password' | 'passwordConfirm'> {
  password?: string;
  passwordConfirm?: string;
}

export interface IMongoUser extends IUser {
  _id: Types.ObjectId;
}
