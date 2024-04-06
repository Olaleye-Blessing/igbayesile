import { MulterError } from 'multer';
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

const handleMulterErrors = (err: MulterError) => {
  if (err.code === 'LIMIT_UNEXPECTED_FILE')
    return new AppError('Maximum number of fields exceeded', 400);

  if (err.code === 'LIMIT_FILE_SIZE')
    return new AppError('File(s) too large', 400);

  return new AppError('Internal server error! Try again', 500);
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
  } else if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired! Please login again', 401);
  } else if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token! Please log in again', 400);
  } else if (err.name === 'MulterError') {
    error = handleMulterErrors(err as unknown as MulterError);
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
