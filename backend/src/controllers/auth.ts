import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '@/models/user';
import { IMongoUser } from '@/interfaces/user';
import AppError from '@/utils/AppError';
import catchAsync from '@/utils/catchAsync';
import { loggedInCookieName } from '@/configs/igbayesile';

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

export const logout = catchAsync(async (req, res) => {
  res.cookie(loggedInCookieName, '', { expires: new Date(0) });

  res.status(200).json({
    status: 'success',
    message: 'Successfully logged out!',
  });
});

export const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies[loggedInCookieName];
  if (!token) return next(new AppError('Please provide a login token', 400));

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  const user = await User.findById(decodedToken.id);

  if (!user) return next(new AppError('This user does not exist', 400));

  if (user.pwdChangedAfterTokenIssued(decodedToken.iat!))
    return next(
      new AppError(
        'Your password has recently been changed. Log in with the new password',
        400,
      ),
    );

  req.user = user;
  next();
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  if (!email) return next(new AppError('Please provide a email!'));

  const user = await User.findOne({ email });

  const status = 'success',
    message =
      'We have sent a password reset link to the email address you provided. If the email address is associated with an account in our system, you will receive the link shortly.',
    statusCode = 200;

  if (!user) return res.status(statusCode).json({ status, message });

  const resetToken = user.setPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  let resetUrl = '';

  if (process.env.NODE_ENV === 'production' || req.headers.origin) {
    resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/?token=${resetToken}`;
  } else {
    resetUrl = `${req.protocol}:://${req.get(
      'host',
    )}/api/v1/auth/reset-password/?token=${resetToken}`;
  }

  // TODO: send a mail

  return res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { resetUrl }),
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  if (!token) return next(new AppError('Please provide a reset token', 400));

  const passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gte: new Date(Date.now()) },
  });

  if (!user)
    return next(
      new AppError(
        'This token is invalid or expired! Request for a new one',
        400,
      ),
    );

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // middleware changes the passwordResetAt property

  await user.save();

  res.status(200).json({
    status: 'success',
    message:
      'Password reset successfully. You can login with your new password now!',
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;

  if (!currentPassword || !password || !passwordConfirm)
    return next(new AppError('Preovide all required fields', 400));

  // There will always be a user since this is a protected route
  const user = (await User.findById(req.user!._id).select('+password'))!;

  const isPwdCorrect = await user.correctPassword(
    currentPassword,
    user.password,
  );

  if (!isPwdCorrect) return next(new AppError(`Incorrect password`, 400));

  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  sendToken(user, res);
});

function signToken(userId: Types.ObjectId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_LOGGED_IN_EXPIRES!,
  });
}

function sendToken(user: IMongoUser, res: Response) {
  const token = signToken(user._id);

  res.cookie(loggedInCookieName, token, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    path: '/',
    sameSite: 'strict',
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
