/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  JWT_LOGGED_IN_EXPIRES,
  JWT_LOGGEDIN_DEVICE_SECRET,
  JWT_LOGIN_SECRET,
  JWT_REFRESH_LOGIN_EXPIRES,
  JWT_REFRESH_LOGIN_SECRET,
  refreshLoginCookieName,
} from '@/configs/igbayesile';
import { TAuthTokenMode } from '@/interfaces/auth';
import { IUser } from '@/interfaces/user';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { removeDocFields } from './remove-doc-fields';

export const authenticateUser = (
  user: IUser,
  res: Response,
  mode: TAuthTokenMode,
  status = 200,
) => {
  setRefreshToken(user, res);

  removeDocFields({
    doc: user,
    keys: [
      'password',
      'passwordConfirm',
      'passwordResetExpires',
      'passwordResetAt',
      'passwordResetToken',
      'devices',
      'updatedAt',
      'emailChangedAt',
      'createdAt',
    ],
  });

  res.status(status).json({
    status: 'success',
    data: {
      authToken: createAuthToken(user, mode),
      user,
    },
  });
};

export const createAuthToken = (user: IUser, mode: TAuthTokenMode) => {
  const authToken = jwt.sign({ id: user._id, mode }, JWT_LOGIN_SECRET, {
    expiresIn: JWT_LOGGED_IN_EXPIRES,
  });

  return authToken;
};

export const setRefreshToken = (user: IUser, res: Response) => {
  res.cookie(
    refreshLoginCookieName,
    jwt.sign({ id: user._id }, JWT_REFRESH_LOGIN_SECRET, {
      expiresIn: JWT_REFRESH_LOGIN_EXPIRES,
    }),
    {
      httpOnly: true,
      secure: true,
      // path: '/refresh-token',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  );
};

type ICommonLoginBruteForceToken = { jwtid: string };
type IAuthLoginBruteForceToken = { auth: 'yes'; user: IUser };
type INonAuthLoginBruteForceToken = { auth: 'no'; user?: never };

type ILoginBruteForce = ICommonLoginBruteForceToken &
  (IAuthLoginBruteForceToken | INonAuthLoginBruteForceToken);

export const loginBruteForceToken = ({
  auth,
  user,
  jwtid,
}: ILoginBruteForce) => {
  return jwt.sign({ auth }, JWT_LOGGEDIN_DEVICE_SECRET, {
    ...(user && { subject: user.email }),
    jwtid,
    audience: 'brute-force',
    issuer: 'igbayesile',
  });
};
