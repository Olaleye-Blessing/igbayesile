import { isAxiosError } from "axios";

export const handleIgbayesileAPIError = (_error: unknown) => {
  let msg = "";
  if (isAxiosError(_error)) {
    msg = _error.response?.data.message;
  } else {
    msg = "unknown";
  }

  return msg;
};
