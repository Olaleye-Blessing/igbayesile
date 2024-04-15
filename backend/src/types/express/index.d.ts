import { IAuthJWTPayLoad } from '@/interfaces/auth';
import { IUser } from '../../interfaces/user';
import { ICache } from '@/interfaces/factory';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      decodedAuthToken?: IAuthJWTPayLoad;
      factory?: {
        cache?: ICache;
      };
    }
  }
}
