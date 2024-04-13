import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '@/utils/AppError';
import catchAsync from '@/utils/catchAsync';
import { JWT_LOGIN_SECRET } from '@/configs/igbayesile';
import User from '@/models/user';

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

  const decodedToken = jwt.verify(token, JWT_LOGIN_SECRET) as JwtPayload;

  const user = await User.findById(decodedToken.id);

  if (!user) return next(new AppError('This user does not exist', 401));

  if (user.pwdChangedAfterTokenIssued(decodedToken.iat!))
    return next(
      new AppError(
        'Your password has recently been changed. Log in with the new password',
        401,
      ),
    );

  req.user = user;
  next();
});
