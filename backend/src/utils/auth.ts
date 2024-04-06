import {
  JWT_LOGGED_IN_EXPIRES,
  JWT_LOGIN_SECRET,
  JWT_REFRESH_LOGIN_EXPIRES,
  JWT_REFRESH_LOGIN_SECRET,
  refreshLoginCookieName,
} from '@/configs/igbayesile';
import { IUser } from '@/interfaces/user';
import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateUser = (user: IUser, res: Response, status = 200) => {
  setRefreshToken(user, res);

  res.status(status).json({
    status: 'success',
    data: {
      authToken: createAuthToken(user),
      user,
    },
  });
};

export const createAuthToken = (user: IUser) => {
  const authToken = jwt.sign({ id: user._id }, JWT_LOGIN_SECRET, {
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
