import { API_BASE_URL } from "@dashboard/constants/backend";
import useAuthStore from "@dashboard/stores/auth";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { IUser } from "@ui/interfaces/user";

export interface ILoginResponse {
  authToken: string;
  user: IUser;
}

export const useIGBInstance = () => {
  const router = useRouter();
  const authToken = useAuthStore((state) => state.token);
  const updateToken = useAuthStore((state) => state.updateToken);
  const logout = useAuthStore((state) => state.logout);

  const refreshToken = async () => {
    updateToken({ status: "refreshing" });

    const {
      data: { data },
    } = await axios.post<{ data: ILoginResponse }>(
      `${API_BASE_URL}/auth/refresh-token`,
      undefined,
      { withCredentials: true },
    );

    updateToken({ status: "stable", token: data.authToken });

    return data;
  };

  const igbInstance = () => {
    let instance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
    });

    if (authToken.status !== "not-authenticated") {
      instance.defaults.headers.common.Authorization = `Bearer ${authToken.jwt}`;
    }

    instance.interceptors.request.use(
      async (req) => {
        if (authToken.status === "not-authenticated") return req;

        if ((authToken.decoded.exp || 0) - Date.now() / 1000 > 45) return req;

        try {
          const response = await refreshToken();

          req.headers.Authorization = `Bearer ${response.authToken}`;

          return req;
        } catch (error) {
          toast.error("Token expired! Login again", { id: "refresh-invalid" });

          logout();

          throw router.push(`/auth/login`);
        }
      },
      (error) => Promise.reject(error),
    );

    instance.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        const { response, config } = error;

        const tokenNotExpired =
          !/token expired! please login/i.test(
            (response?.data as any).message,
          ) || !config;

        if (tokenNotExpired) return Promise.reject(error);

        try {
          const response = await refreshToken();

          config.headers.Authorization = `Bearer ${response.authToken}`;

          return instance(config);
        } catch (error) {
          toast.error("Token expired! Login again", { id: "refresh-invalid" });

          logout();

          throw router.push(`/auth/login`);
        }
      },
    );

    return instance;
  };

  return { igbInstance, refreshToken };
};
