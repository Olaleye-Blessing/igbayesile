import { IUser } from '@/interfaces/user';
import { Request } from 'express';

export interface IAuthUserReq extends Request {
  user: IUser;
}
