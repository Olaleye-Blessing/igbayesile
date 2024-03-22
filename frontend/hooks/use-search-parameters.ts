import { usePathname, useRouter, useSearchParams } from "next/navigation";

type TAction = "push" | "replace" | "normal";

const useSearchParameters = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams()!;

  function getParam(key: string) {
    return searchParams.get(key);
  }

  function updateParams(
    params: { [key: string]: string },
    action: TAction = "normal",
  ) {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

    Object.entries(params).forEach(([key, value]) => {
      current.set(key, value);
    });

    return acts(current, action);
  }

  function deleteParams(keys: string[], type: TAction) {
    const search = new URLSearchParams(Array.from(searchParams.entries()));

    keys.forEach((key) => search.delete(key));

    return acts(search, type);
  }

  function acts(search: URLSearchParams, action: TAction) {
    const params = search.toString();

    const route = `${pathname}?${params}`;

    if (action === "normal") return route;

    if (action === "push") return router.push(route);

    router.replace(route);
  }

  return {
    getParam,
    updateParams,
    deleteParams,
  };
};

export default useSearchParameters;
