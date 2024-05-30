import { IUser } from "@ui/interfaces/user";

export interface ILoginResponse {
  authToken: string;
  user: IUser;
}
