export const addPageParam = (url: string, page: number) => {
  // Check if the URL already has a query string
  const hasQueryString = url.includes("?");

  // Handle URLs without a query string
  if (!hasQueryString) return `${url}?page=${page}`;

  // Extract existing query parameters
  const existingParams = new URLSearchParams(url.slice(url.indexOf("?") + 1));

  // Check if a page parameter already exists
  if (existingParams.has("page")) {
    existingParams.set("page", String(page));
  } else {
    existingParams.append("page", String(page));
  }

  // Rebuild the URL with updated query string
  return `${url.slice(0, url.indexOf("?"))}?${existingParams.toString()}`;
};
