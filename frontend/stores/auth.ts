import { IUser } from "@/interfaces/user";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { jwtDecode, JwtPayload } from "jwt-decode";

type TTokenUnAuth = {
  status: "not-authenticated";
  jwt: null;
  decoded: null;
};

type TTokenAuth = {
  status: "stable" | "refreshing";
  jwt: string;
  decoded: JwtPayload;
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
    })),
  ),
);

const decodeToken = (token: string) => jwtDecode<JwtPayload>(token);

export default useAuthStore;
