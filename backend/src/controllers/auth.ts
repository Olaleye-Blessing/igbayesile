import { Request, Response } from 'express';
import User from './../models/user';
import { IUserWithNoCredential } from './../interfaces/user';

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
