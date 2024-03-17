declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      DB_URL: string;
      DB_PASSWORD: string;
    }
  }
}

export {};
