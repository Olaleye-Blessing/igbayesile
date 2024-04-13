import { JwtPayload } from "jwt-decode";

export type TAuthTokenMode = "login" | "refresh";

export interface IAuthJWTPayLoad extends JwtPayload {
  mode: TAuthTokenMode;
  id: string;
}
