export interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'guest' | 'manager';
}

export interface IUserWithNoCredential
  extends Omit<IUser, 'password' | 'passwordConfirm'> {
  password?: string;
  passwordConfirm?: string;
}
