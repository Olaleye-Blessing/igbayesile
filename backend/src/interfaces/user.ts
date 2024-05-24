import { IBaseUser } from '@/schemas/auth';
import { Types } from 'mongoose';
import { IResult as IDeviceDetail } from 'ua-parser-js';

export interface IUser extends IBaseUser {
  _id: Types.ObjectId;
  avatar: string;
  emailChangedAt: Date;
  createdAt: Date;
  updatedAt: Date;
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
