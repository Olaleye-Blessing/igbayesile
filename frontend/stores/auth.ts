import { IUser } from "@/interfaces/user";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { jwtDecode } from "jwt-decode";
import { IAuthJWTPayLoad } from "@/interfaces/auth";

type TTokenUnAuth = {
  status: "not-authenticated";
  jwt: null;
  decoded: null;
};

type TTokenAuth = {
  status: "stable" | "refreshing";
  jwt: string;
  decoded: IAuthJWTPayLoad;
};

type IToken = TTokenAuth | TTokenUnAuth;

const defaultToken: TTokenUnAuth = {
  status: "not-authenticated",
  jwt: null,
  decoded: null,
};

interface State {
  user: IUser | null;
  token: IToken;
}

type ITokenPayload =
  | { status: "refreshing" | "not-authenticated" }
  | { status: "stable"; token: string };

interface Actions {
  login: (user: IUser, token: string) => void;
  logout: () => void;
  updateToken: (payload: ITokenPayload) => void;
  updateUser: (user: IUser) => void;
}

type Store = State & Actions;

const useAuthStore = create<Store>()(
  devtools(
    immer((set) => ({
      user: null,
      token: defaultToken,
      login: (user, token) => {
        set({
          user,
          token: {
            jwt: token,
            status: "stable",
            decoded: decodeToken(token),
          },
        });
      },
      logout: () => set({ user: null, token: defaultToken }),
      updateToken: (payload) =>
        set((state) => {
          state.token.status = payload.status;

          if (payload.status === "not-authenticated") {
            state.token.decoded = null;
            state.token.jwt = null;
          } else if (payload.status === "stable") {
            state.token.jwt = payload.token;
            state.token.decoded = decodeToken(payload.token);
          }
        }),
      updateUser: (user) => set({ user }),
    })),
  ),
);

const decodeToken = (token: string) => jwtDecode<IAuthJWTPayLoad>(token);

export default useAuthStore;
