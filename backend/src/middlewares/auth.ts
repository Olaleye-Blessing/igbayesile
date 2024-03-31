import AppError from '@/utils/AppError';
import catchAsync from '@/utils/catchAsync';

export const restrictTo = (...roles: string[]) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user!.role))
      return next(
        new AppError('You are not allowed to perform this action', 403),
      );

    next();
  });
