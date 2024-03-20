import { IUser } from "@/interfaces/user";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  user: IUser | null;
}

interface Actions {
  login: (user: IUser) => void;
}

type Store = State & Actions;

const useAuthStore = create<Store>()(
  devtools(
    immer(
      persist(
        (set) => ({
          user: null,
          login: (user) => set({ user }),
        }),
        { name: "auth" },
      ),
    ),
  ),
);

export default useAuthStore;
