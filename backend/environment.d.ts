declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      DB_URL: string;
      DB_PASSWORD: string;
      JWT_SECRET: string;
      JWT_LOGGED_IN_EXPIRES: string;
    }
  }
}

export {};
