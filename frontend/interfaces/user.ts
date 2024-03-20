export interface IUser {
  name: string;
  email: string;
  createdAt: Date;
  role: "guest" | "manager";
}
