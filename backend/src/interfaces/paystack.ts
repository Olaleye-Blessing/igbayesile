export interface IPayStackInitSuccesRes {
  status: true;
  message: 'Authorization URL created';
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface IPayStackInitErrorRes {
  status: false;
  message: 'Format is Authorization Bearer [secret key]' | string;
  meta: {
    nextStep:
      | `Ensure that the authorization header follows the format: "Bearer YOUR_SECRET_KEY". Ex. 'Authorization: Bearer sk_123456789'`
      | string;
  };
  type: 'validation_error' | string;
  code: 'authorization_key' | string;
}

interface CustomFields {
  display_name: string;
  variable_name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export interface IPayStackInitParams {
  amount: number;
  email: string;
  metadata: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    // fields that show up in the dashboard
    custom_fields?: CustomFields[];
    cancel_action?: string; //'https://your-cancel-url.com';
  };
  currency?: string;
  callback_url?: string;
}

export enum PaystackVerificationStatues {
  'abandoned' = 'abandoned',
  'failed' = 'failed',
  'ongoing' = 'ongoing',
  'pending' = 'pending',
  'processing' = 'processing',
  'queued' = 'queued',
  'reversed' = 'reversed',
  'success' = 'success',
}

export interface IPayStackVerifySuccessRes {
  status: true;
  message: 'Verification successful';
  data: {
    id: 2009945086;
    domain: string;
    status: PaystackVerificationStatues.success;
    reference: string;
    amount: number;
    message: null;
    gateway_response: 'Successful';
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: string;
    log: {
      start_time: 1660054888;
      time_spent: 4;
      attempts: 1;
      errors: 0;
      success: true;
      mobile: false;
      input: [];
    };
    fees: number;
    order_id: null;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    transaction_date: string;
  };
}

export interface IPayStackVerifyErrorRes {
  status: false;
  message: string;
  meta: {
    nextStep: string;
  };
  type: string;
  code: string;
}
