/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import AppError from './AppError';

type TSchema = z.ZodObject<any, any> | z.ZodEffects<z.ZodObject<any, any>>;

type TPath = 'body' | 'params' | 'file';

type IValidatePayload = {
  schema: TSchema;
  path?: TPath;
  errCode?: number;
};

export const nonEmptyStringSchema = z
  .string()
  .trim()
  .min(1, { message: 'is required' });

export const zodMustBeNumberSchema = z.coerce.number({
  invalid_type_error: 'must be number',
});

export const validateData =
  ({ schema, path = 'body', errCode = 400 }: IValidatePayload) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req[path]);

      next();
    } catch (error) {
      if (!(error instanceof ZodError))
        return next(new AppError('Internal Server error', 500));

      const messages = error.errors
        .reduce((msgs, current) => {
          msgs += `${current.path[0]}: ${current.message}.\n`;

          return msgs;
        }, '')
        .trim();

      return next(new AppError(messages, errCode));
    }
  };
