export interface IUser {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  role: "guest" | "manager" | "staff";
  avatar: string;
}
