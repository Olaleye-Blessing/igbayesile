import jwt from 'jsonwebtoken';
import AppError from '@/utils/AppError';
import catchAsync from '@/utils/catchAsync';
import User from '@/models/user';
import { IAuthJWTPayLoad } from '@/interfaces/auth';
import { redisClient } from '@/databases/redis';
import { authTokenBLPrefix } from '@/configs/db';
import { envData } from '@/configs/env-data';

export const restrictTo = (...roles: string[]) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user!.role))
      return next(
        new AppError('You are not allowed to perform this action', 403),
      );

    next();
  });

export const protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split(' ')[1];

  if (!token) return next(new AppError('Please provide a login token', 401));

  if (await redisClient.get(`${authTokenBLPrefix}${token}`)) {
    return next(new AppError(`Access rejected! Login again!`, 403));
  }

  const decodedToken = jwt.verify(
    token,
    envData.JWT_LOGIN_SECRET,
  ) as IAuthJWTPayLoad;

  const user = await User.findById(decodedToken.id);

  if (!user) return next(new AppError('This user does not exist', 401));

  if (user.credentialsChangedAfterTokenIssued(decodedToken.iat!))
    return next(
      new AppError('Your credentials changed recently. Log in again', 401),
    );

  req.user = user;
  req.decodedAuthToken = decodedToken;
  next();
});

export const justLoggedIn = catchAsync(async (req, res, next) => {
  if (req.decodedAuthToken!.mode !== 'login')
    return next(new AppError('Login again to perform this action', 403));

  next();
});
