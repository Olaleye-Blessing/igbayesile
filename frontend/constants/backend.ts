export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const API_BASE_URL = `${BACKEND_URL}/api/v1`;
