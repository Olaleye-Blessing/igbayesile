export const refreshLoginCookieName =
  process.env.NODE_ENV === 'production' ? '__Secure-igba-ra' : 'refreshToken';

export const JWT_LOGGED_IN_EXPIRES = process.env.JWT_LOGGED_IN_EXPIRES!;

export const JWT_LOGIN_SECRET = process.env.JWT_LOGIN_SECRET!;

export const JWT_REFRESH_LOGIN_SECRET = process.env.JWT_REFRESH_LOGIN_SECRET!;

export const JWT_REFRESH_LOGIN_EXPIRES = process.env.JWT_REFRESH_LOGIN_EXPIRES!;

export const JWT_LOGGEDIN_DEVICE_SECRET =
  process.env.JWT_LOGGEDIN_DEVICE_SECRET!;

export const loggedInDeviceCookieName = '_logged-device';
