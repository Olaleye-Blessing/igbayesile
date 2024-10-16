declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      DB_URL: string;
      DB_PASSWORD: string;
      JWT_LOGIN_SECRET: string;
      JWT_REFRESH_LOGIN_SECRET: string;
      JWT_LOGGED_IN_EXPIRES: string;
      FRONTEND_URL: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      PAYSTACK_PUBLIC_KEY: string;
      PAYSTACK_SECRET_KEY: string;
      REDIS_URL: string;
      RESEND_KEY: string;
    }
  }
}

export {};
