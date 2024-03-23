import { API_BASE_URL } from "@/constants/backend";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
import axios from "axios";

export const useIGBInstance = () => {
  let instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  const igbInstance = () => {
    instance.interceptors.response.use(undefined, async (error) => {
      // const originalRequest = error.config;
      const errorMsg = handleIgbayesileAPIError(error);

      if (!errorMsg.includes("Token expired")) return Promise.reject(error);

      // TODO: Send request to refresh token
      /*
      Backend things!!
      Two things came to my mind now:
      1. Include a refresh token(cookie, with path="/refresh-auth-token") when user authenticates. Refresh token should be valid for 1 month.
      2. Do not include refresh token. Have a refresh route. Just refresh the token using the user ID.
      */
      // return instance(originalRequest); // Uncomment when refresh token is implemented.

      return Promise.reject(error);
    });

    return instance;
  };

  return { igbInstance };
};
