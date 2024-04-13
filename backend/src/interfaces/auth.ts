import { JwtPayload } from 'jsonwebtoken';

export type TAuthTokenMode = 'login' | 'refresh';

export interface IAuthJWTPayLoad extends JwtPayload {
  mode: TAuthTokenMode;
  id: string;
}
