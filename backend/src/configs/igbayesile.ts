import { envData } from './env-data';

export const refreshLoginCookieName =
  envData.NODE_ENV === 'production' ? '__Secure-igba-ra' : 'refreshToken';
