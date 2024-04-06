import { IUser } from "@/interfaces/user";

export interface ILoginResponse {
  authToken: string;
  user: IUser;
}
