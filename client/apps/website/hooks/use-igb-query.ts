import {
  QueryKey,
  UndefinedInitialDataOptions,
  useQuery,
} from "@tanstack/react-query";
import { useIGBInstance } from "./use-igb-instance";
import { handleIgbayesileAPIError } from "@website/utils/handle-igbayesile-api-error";
import { AxiosRequestConfig } from "axios";

export const useIGBQuery = <TData = unknown>({
  options,
  url,
  axiosConfig,
}: {
  options: UndefinedInitialDataOptions<TData, Error, TData, QueryKey>;
  url: string;
  axiosConfig?: AxiosRequestConfig;
}) => {
  const { igbInstance } = useIGBInstance();

  return useQuery({
    ...options,
    refetchOnWindowFocus: false,
    retry: 0,
    // TODO: Update this enable token.
    /**
     * something like: enabled:
     * useAuth().tokenStatus !== refreshing && options.enabled
     * This is to prevent duplicate calls to when users try to
     * access a protected page while trying to refresh the token
     */
    queryFn:
      options.queryFn ??
      // TODO: Test this signal on other requests
      (async ({ signal }) => {
        try {
          let { data } = await igbInstance().get<{
            status: "success";
            data: TData;
          }>(url, { ...axiosConfig, signal });

          return data.data as TData;
        } catch (error) {
          throw new Error(handleIgbayesileAPIError(error));
        }
      }),
  });
};
