import { Request, Response } from 'express';
import User from '@/models/user';
import { IUserWithNoCredential } from '@/interfaces/user';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  // TODO: Move this to a global error handler
  if (!name || !email || !password || !passwordConfirm || !role)
    return res.status(400).json({
      status: 'error',
      message: 'Please provide all details',
    });

  try {
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
  } catch (error) {
    console.log(error);

    // TODO: Move this to a global error handler
    return res.status(500).json({
      status: 'success',
      message: 'Internal server error',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // TODO: Move this to a global error handler
  if (!email && !password)
    return res.status(400).json({
      status: 'error',
      message: 'Provide email and password',
    });
  if (!email)
    return res.status(400).json({
      status: 'error',
      message: 'Provide email',
    });
  if (!password)
    return res.status(400).json({
      status: 'error',
      message: 'Provide password',
    });

  try {
    const user = await User.findOne({ email }).select('+password');

    // Investigate this issue
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!user || !(await user.correctPassword(password, user.password)))
      return res.status(400).json({
        status: 'error',
        message: 'Incorrect email or password',
      });

    // @ts-expect-error Do not send password to the client;
    user.password = undefined;

    return res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
