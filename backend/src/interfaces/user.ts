import { Types } from 'mongoose';
import { IResult as IDeviceDetail } from 'ua-parser-js';

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
  devices: {
    id: string;
    ip: string | undefined;
    meta: IDeviceDetail;
    time: Date;
  }[];
}

export interface IUserWithNoCredential
  extends Omit<IUser, 'password' | 'passwordConfirm'> {
  password?: string;
  passwordConfirm?: string;
}

export interface IMongoUser extends IUser {
  _id: Types.ObjectId;
}
