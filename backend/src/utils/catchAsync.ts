import { NextFunction, Request, Response } from 'express';

const catchAsync =
  <Req extends Request>(
    fn: (
      req: Req,
      res: Response,
      next: NextFunction,
    ) => Promise<Response | void>,
  ) =>
  (req: Req, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export default catchAsync;
