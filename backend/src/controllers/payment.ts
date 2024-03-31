import https from 'https';
import { initializeOptions, verifyPaymentOptions } from '@/configs/paystack';
import catchAsync from '@/utils/catchAsync';
import {
  IPayStackInitErrorRes,
  IPayStackInitParams,
  IPayStackInitSuccesRes,
  IPayStackVerifyErrorRes,
  IPayStackVerifySuccessRes,
} from '@/interfaces/paystack';
import AppError from '@/utils/AppError';

export const initializePayStack = catchAsync(async (req, res, next) => {
  // TODO: Extend express req to have payment.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payment = (req as any).payment as IPayStackInitParams;

  // TODO: Provide the above interface in your route
  if (!payment.email || !payment.amount)
    return next(new Error('Internal server error'));

  const params = JSON.stringify({ ...payment });

  const paystackReq = https
    .request(initializeOptions, (apiRes) => {
      let data = '';
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      apiRes.on('end', () => {
        const paymentInit: IPayStackInitSuccesRes | IPayStackInitErrorRes =
          JSON.parse(data);

        if (!paymentInit.status) {
          return next(new Error(JSON.stringify(paymentInit)));
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).payment_init = paymentInit.data;

        next();
      });
    })
    .on('error', (error) => {
      return next(error);
    });

  paystackReq.write(params);

  paystackReq.end();
});

export const verifyPayment = catchAsync(async (req, res, next) => {
  const reference = req.body.reference;

  if (!reference)
    return next(new AppError('Provide the payment reference', 400));

  https
    .request(
      { ...verifyPaymentOptions, path: `/transaction/verify/${reference}` },
      (_res) => {
        let data = '';

        _res.on('data', (chunk) => {
          data += chunk;
        });

        _res.on('end', () => {
          const verificationData:
            | IPayStackVerifyErrorRes
            | IPayStackVerifySuccessRes = JSON.parse(data);

          if (verificationData.status === false) {
            if (verificationData.code === 'transaction_not_found') {
              return next(
                new AppError(
                  'Invalid transaction! Kindly contact customer support if you have been charged!',
                  400,
                ),
              );
            }

            // TODO: Create a logging system
            return next(new Error('Internal server error!'));
          }

          // TODO: Extend express request
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (req as any).payment_verification = verificationData;

          next();
        });
      },
    )
    .on('error', (error) => {
      console.log(error);
      // TODO: Create a logging system
      return next(new Error('Internal server error!'));
    })
    .end();
});
