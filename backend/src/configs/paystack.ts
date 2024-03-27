const commonOptions = {
  hostname: 'api.paystack.co',
  port: 443,
  headers: {
    Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
  },
};

export const initializeOptions = {
  ...commonOptions,
  path: '/transaction/initialize',
  method: 'POST',
  headers: {
    ...commonOptions.headers,
    'Content-Type': 'application/json',
  },
};

export const verifyPaymentOptions = {
  ...commonOptions,
  // path: '/transaction/verify/:reference'
  method: 'GET',
};
