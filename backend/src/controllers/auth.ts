import crypto from 'crypto';
import { nanoid } from 'nanoid';
import uap from 'ua-parser-js';
import User from '@/models/user';
import AppError from '@/utils/AppError';
import catchAsync from '@/utils/catchAsync';
import {
  JWT_LOGGEDIN_DEVICE_SECRET,
  JWT_REFRESH_LOGIN_SECRET,
  loggedInDeviceCookieName,
  refreshLoginCookieName,
} from '@/configs/igbayesile';
import { authenticateUser, loginBruteForceToken } from '@/utils/auth';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { redisClient } from '@/databases/redis';
import LoginAttempt from '@/models/login-attempts';

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

  authenticateUser(user, res, 'login', 201);
});

export const validateLoginCookie = catchAsync(async (req, res, next) => {
  const loggedInDeviceToken = req.cookies[loggedInDeviceCookieName];

  if (!loggedInDeviceToken) return next();

  try {
    const payload = jwt.verify(
      loggedInDeviceToken,
      JWT_LOGGEDIN_DEVICE_SECRET,
      {
        audience: 'brute-force',
        issuer: 'igbayesile',
      },
    );

    if (
      await redisClient.lPos(
        'loginBlockLists',
        payload.sub || loggedInDeviceToken,
      )
    )
      return res.status(401).json({ status: 'Werey ni e' });

    next();
  } catch (error) {
    // any error leads to block list
    await redisClient.lPush('loginBlockLists', loggedInDeviceToken);

    return res.status(401).json({ status: 'Werey ni e' });
  }
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password)
    return next(new AppError('Provide email and password', 400));

  if (!email) return next(new AppError('Provide email', 400));
  if (!password) return next(new AppError('Provide password', 400));

  let user = await User.findOne({ email }).select('+password +devices');

  const device = {
    id: nanoid(),
    ip: req.ip,
    time: new Date(),
    meta: uap(req.headers['user-agent']),
  };

  const loggedInCookie = req.cookies[loggedInDeviceCookieName];

  if (!user || !(await user.correctPassword(password, user.password))) {
    const jwtToken = loginBruteForceToken({ auth: 'no', jwtid: device.id });
    const attempt = {
      user: user?.id,
      date: new Date(),
      cookie: loggedInCookie,
      // key: device.id,
      key: device.ip,
    };

    // const query = {
    //   $or: [
    //     user && { user: user.id },
    //     attempt.cookie && { cookie: attempt.cookie },
    //     { key: attempt.key },
    //   ].filter((q) => q),
    // };

    // const prevAttempt = await LoginAttempt.findOne(query);

    // if (!prevAttempt) {
    //   await LoginAttempt.create(attempt);

    //   return next(new AppError('Incorrect email or password', 401));
    // }

    // // const lockoutDuration = 10 * 60 * 1000; // 10 mins
    // const lockoutDuration = 60 * 1000; // 60 seconds
    // const maxAttempt = 5;
    // const currentTime = new Date();
    // const timeSinceLastAttempt =
    //   prevAttempt.lastAttempt.getTime() - currentTime.getTime();

    // prevAttempt.lastAttempt = currentTime;

    // if (timeSinceLastAttempt > lockoutDuration) {
    //   // reset since duration has passed
    //   prevAttempt.count = 1;

    //   await prevAttempt.save({ validateBeforeSave: false });

    //   return next(new AppError('Incorrect email or password', 401));
    // }

    // prevAttempt.count = Number(prevAttempt.count) + 1;

    // if (prevAttempt.count <= maxAttempt) {
    //   await prevAttempt.save({ validateBeforeSave: false });

    //   return next(new AppError('Incorrect email or password', 401));
    // }

    // prevAttempt.stage = +prevAttempt.stage + 1;

    // if (prevAttempt.stage >= maxAttempt) {
    //   // TODO: add to permanent block -> REDIS
    //   await redisClient.lPush(
    //     'loginBlockLists',
    //     loggedInCookie || prevAttempt.key,
    //   );
    // } else {
    //   // TODO: add to temporary block -> REDIS timeout
    // }

    // await prevAttempt.save({ validateBeforeSave: false });

    return next(new AppError('Incorrect email or password', 401));
  }

  const devices = user.devices || [];

  if (!devices.some((d) => d.ip === device.ip)) {
    // do not send mail for first time login
    if (devices.length !== 0) {
      // TODO: send a mail telling them that an unknown IP address just logged in into their account
      console.log('__ 💻 SEND MAIL FOR UNRECOGNIZED LOGIN ___');
    }

    devices.unshift(device);

    user.devices = devices;

    user = await user.save({ validateBeforeSave: false });
  }

  res.cookie(
    loggedInDeviceCookieName,
    loginBruteForceToken({ auth: 'yes', user, jwtid: device.id }),
    { httpOnly: true, secure: true },
  );

  authenticateUser(user, res, 'login', 200);
});

export const refreshAuthToken = catchAsync(async (req, res, next) => {
  const token = req.cookies[refreshLoginCookieName];

  if (!token) return next(new AppError('Provide a refresh token', 400));

  const decodedToken = jwt.verify(
    token,
    JWT_REFRESH_LOGIN_SECRET,
  ) as JwtPayload;

  const user = await User.findById(decodedToken.id);

  if (!user) return next(new AppError('This user does not exist', 401));

  if (user.credentialsChangedAfterTokenIssued(decodedToken.iat!))
    return next(
      new AppError('Your credentials changed recently. Log in again', 401),
    );

  authenticateUser(user, res, 'refresh', 200);
});

/**
 * TODO: Some ideas on invalidating jwt token:
 * https://stackoverflow.com/questions/21978658/invalidating-json-web-tokens
 * https://stackoverflow.com/a/53994938
 * Revoke refresh token: https://www.youtube.com/watch?v=25GS0MLT8JU&t=4580s
 */
export const logout = catchAsync(async (req, res) => {
  res.cookie(refreshLoginCookieName, '', { expires: new Date(0) });

  // TODO: Decide if a cache-control header should be set: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
  res.status(200).json({
    status: 'success',
    message: 'Successfully logged out!',
    data: {
      authToken: '',
      user: null,
    },
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  if (!email) return next(new AppError('Please provide a email!', 400));

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
        401,
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

  if (!isPwdCorrect) return next(new AppError(`Incorrect password`, 401));

  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  authenticateUser(user, res, 'login', 200);
});

export const loginMe = catchAsync(async (req, res, next) => {
  req.body.email = req.user!.email;

  next();
});

export const updateEmail = catchAsync(async (req, res) => {
  const email = req.body.email;

  req.user!.email = email;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await (req.user! as any).save();

  authenticateUser(user, res, 'login', 200);
});
