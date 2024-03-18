import { NextFunction, Request, Response } from 'express';
import User from '@/models/user';
import { IUserWithNoCredential } from '@/interfaces/user';
import AppError from '@/utils/AppError';
import catchAsync from '@/utils/catchAsync';

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  if (!name || !email || !password || !passwordConfirm || !role)
    return next(new AppError('Please provide all details', 400));

  const user: IUserWithNoCredential = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  user.password = undefined;
  user.passwordConfirm = undefined;

  return res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email && !password)
      return next(new AppError('Provide email and password', 400));

    if (!email) return next(new AppError('Provide email', 400));
    if (!password) return next(new AppError('Provide password', 400));

    const user = await User.findOne({ email }).select('+password');

    // Investigate this issue
    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError('Incorrect email or password', 400));

    // @ts-expect-error Do not send password to the client;
    user.password = undefined;

    return res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  },
);
