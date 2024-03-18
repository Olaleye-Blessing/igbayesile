import AppError from '@/utils/AppError';
import { NextFunction, Request, Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

const duplicateMongoError = (err: Error | AppError) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msg = `Duplicate ${Object.keys((err as any).keyValue)[0]}: ${
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values((err as any).keyValue)[0]
  }`;

  return new AppError(msg, 400);
};

const handleMongoValidationError = (err: Error | AppError) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const message = Object.values<{ message: string }>((err as any).errors)
    .map(({ message }) => message)
    .join('.\n ');

  console.log({ message });

  return new AppError(message, 400);
};

const globalErrorHanlder = async (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  console.log(err);
  let error: AppError;
  // console.log(err.name);

  if (err.name === 'MongoServerError' && err.message.includes('duplicate')) {
    error = duplicateMongoError(err);
  } else if (err.name === 'ValidationError') {
    error = handleMongoValidationError(err);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error = err as any;
  }

  if (!(error instanceof AppError)) {
    error = new AppError('Something went wrong!! Try again later', 500);
  }

  const resBody: { [key: string]: string | Error } = {
    status: error!.status,
    message: error!.message,
  };

  if (!isProduction) resBody.err = err;

  return res.status(error!.statusCode).json(resBody);
};

export default globalErrorHanlder;
