import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '@/models/user';
import { IMongoUser } from '@/interfaces/user';
import AppError from '@/utils/AppError';
import catchAsync from '@/utils/catchAsync';

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  if (!name || !email || !password || !passwordConfirm || !role)
    return next(new AppError('Please provide all details', 400));

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  sendToken(user, res);
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

    sendToken(user, res);
  },
);

export const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.loggedIn;
  if (!token) return next(new AppError('Please provide a login token', 400));

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  const user = await User.findById(decodedToken.id);

  if (!user) return next(new AppError('This user does not exist', 400));

  // TODO: Check if password hasn't been changed

  req.user = user;
  next();
});

function signToken(userId: Types.ObjectId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_LOGGED_IN_EXPIRES!,
  });
}

function sendToken(user: IMongoUser, res: Response) {
  const token = signToken(user._id);

  res.cookie('loggedIn', token, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // @ts-expect-error Do not send password to the client;
  user.password = undefined;
  // @ts-expect-error Do not send password to the client;
  user.passwordConfirm = undefined;

  return res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
}
