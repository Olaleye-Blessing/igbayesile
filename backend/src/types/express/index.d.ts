import { IAuthJWTPayLoad } from '@/interfaces/auth';
import { IUser } from '../../interfaces/user';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      decodedAuthToken?: IAuthJWTPayLoad;
    }
  }
}
