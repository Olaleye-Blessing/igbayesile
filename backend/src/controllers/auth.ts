import crypto from 'crypto';
import { nanoid } from 'nanoid';
import uap from 'ua-parser-js';
import { v2 as cloudinary } from 'cloudinary';
import User from '@/models/user';
import AppError from '@/utils/AppError';
import catchAsync from '@/utils/catchAsync';
import { refreshLoginCookieName } from '@/configs/igbayesile';
import { authenticateUser } from '@/utils/auth';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import {
  deleteCloudinaryImg,
  extractCloudinaryImgPublicId,
} from '@/utils/cloudinary';
import { IAuthJWTPayLoad } from '@/interfaces/auth';
import { redisClient } from '@/databases/redis';
import { authTokenBLPrefix, refreshTokenBlPrefix } from '@/configs/db';
import { sendEmail } from '@/utils/email';
import { envData } from '@/configs/env-data';

const defaultAvatar =
  'https://res.cloudinary.com/dxgwsomk7/image/upload/v1714900541/frontend/images/no-avatar_xdut3c.webp';

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

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password)
    return next(new AppError('Provide email and password', 400));

  if (!email) return next(new AppError('Provide email', 400));
  if (!password) return next(new AppError('Provide password', 400));

  let user = await User.findOne({ email }).select('+password +devices');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  const device = {
    id: nanoid(),
    ip: req.ip,
    time: new Date(),
    meta: uap(req.headers['user-agent']),
  };

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

  authenticateUser(user, res, 'login', 200);
});

export const refreshAuthToken = catchAsync(async (req, res, next) => {
  const token = req.cookies[refreshLoginCookieName];

  if (!token) return next(new AppError('Provide a refresh token', 400));

  // TODO: Decide if blocking ip address is okay
  if (await redisClient.get(`${refreshTokenBlPrefix}${token}`)) {
    res.cookie(refreshLoginCookieName, '', { expires: new Date(0) });
    return next(new AppError(`Access rejected! Login again!`, 403));
  }

  const decodedToken = jwt.verify(
    token,
    envData.JWT_REFRESH_LOGIN_SECRET,
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
export const logout = catchAsync(async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const refreshToken = req.cookies[refreshLoginCookieName];

  if (!accessToken) return next(new AppError('You were not logged in!', 401));

  try {
    const decodedToken = jwt.verify(
      accessToken,
      envData.JWT_LOGIN_SECRET,
    ) as IAuthJWTPayLoad;
    const decodedReresh = jwt.verify(
      refreshToken,
      envData.JWT_REFRESH_LOGIN_SECRET,
    ) as JwtPayload;

    await redisClient.set(`${authTokenBLPrefix}${accessToken}`, accessToken, {
      EX: Math.ceil(decodedToken.exp! - Date.now() / 1000),
    });
    await redisClient.set(
      `${refreshTokenBlPrefix}${refreshToken}`,
      refreshToken,
      {
        EX: Math.ceil(decodedReresh.exp! - Date.now() / 1000),
      },
    );
  } catch (error) {
    const _error = error as JsonWebTokenError;
    if (_error.name === 'JsonWebTokenError') {
      // TODO: Block ip address
    }
  }

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

  if (envData.NODE_ENV === 'production' || req.headers.origin) {
    resetUrl = `${envData.FRONTEND_URL}/auth/reset-password/?token=${resetToken}`;
  } else {
    resetUrl = `${req.protocol}:://${req.get(
      'host',
    )}/api/v1/auth/reset-password/?token=${resetToken}`;
  }

  const { error } = await sendEmail({
    type: 'onboarding',
    to: [email],
    subject: 'Reset Your Igbayesile Password<Valid for 1 hour>',
    html: `<div>
      <p>It looks like someone submitted a request to reset your Igbayesile password. There's nothing to do or worry about if it wasn't you. You can keep on keeping on.</p>
      <p>If this was you, <a href="${resetUrl}">reset your password</a> and get back into your account.</p>
    </div>`,
  });

  if (error) return next(new AppError('Internal Server Error', 500));

  return res.status(statusCode).json({
    status,
    message,
    ...(envData.NODE_ENV === 'development' && { resetUrl }),
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

export const updateAvatar = catchAsync(async (req, res, next) => {
  let user = req.user!;

  const avatarFile = req.file;

  if (!avatarFile) return next(new AppError('Provide an avatar', 400));

  const supportedTypes = ['jpg', 'jpeg', 'png'];

  if (!supportedTypes.some((type) => avatarFile.mimetype.endsWith(type)))
    return next(
      new AppError(
        `Image type not supported. Only ${supportedTypes.join(',')} are supported!`,
        400,
      ),
    );

  const oneMb = 1024 * 1024;

  if (avatarFile.size >= oneMb)
    return next(new AppError('Avatar must be less than 1 MB', 413));

  const avatarB64 = Buffer.from(avatarFile.buffer).toString('base64');
  const avatarURI = 'data:' + avatarFile.mimetype + ';base64,' + avatarB64;
  const avatarURL = await cloudinary.uploader.upload(avatarURI, {
    folder: 'profiles',
  });

  // TODO: Learn how to do background job. Like move this operation to another thread
  if (user.avatar !== defaultAvatar) {
    await deleteCloudinaryImg(
      `profiles/${extractCloudinaryImgPublicId(user.avatar)}`,
      { invalidate: true },
    );
  }

  const avatar = avatarURL.secure_url;

  user.avatar = avatar;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user = await (user as any).save({ validateBeforeSave: false });

  res.status(200).json({ status: 'success', data: { user } });
});

export const loginMe = catchAsync(async (req, res, next) => {
  req.body.email = req.user!.email;

  next();
});

export const deleteAvatar = catchAsync(async (req, res, next) => {
  let user = req.user!;

  if (user.avatar === defaultAvatar)
    return next(new AppError("You haven't uploaded an avatar yet.", 400));

  await deleteCloudinaryImg(
    `profiles/${extractCloudinaryImgPublicId(user.avatar)}`,
    { invalidate: true },
  );

  user.avatar = defaultAvatar;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user = await(user as any).save({ validateBeforeSave: false });

  res.status(200).json({ status: 'success', data: { user } });
});

export const updateEmail = catchAsync(async (req, res) => {
  const email = req.body.email;

  req.user!.email = email;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await (req.user! as any).save();

  authenticateUser(user, res, 'login', 200);
});
