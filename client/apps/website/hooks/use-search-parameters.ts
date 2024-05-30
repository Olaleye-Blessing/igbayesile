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
    scroll: boolean = false,
  ) {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

    Object.entries(params).forEach(([key, value]) => {
      current.set(key, value);
    });

    return acts(current, action, scroll);
  }

  function deleteParams(
    keys: string[],
    type: TAction,
    scroll: boolean = false,
  ) {
    const search = new URLSearchParams(Array.from(searchParams.entries()));

    keys.forEach((key) => search.delete(key));

    return acts(search, type, scroll);
  }

  function entries() {
    return searchParams.entries();
  }

  function stringnify() {
    return searchParams.toString();
  }

  function acts(search: URLSearchParams, action: TAction, scroll = false) {
    const params = search.toString();

    const route = `${pathname}?${params}`;

    if (action === "normal") return route;

    if (action === "push") return router.push(route, { scroll });

    router.replace(route, { scroll });
  }

  return {
    getParam,
    updateParams,
    deleteParams,
    entries,
    stringnify,
  };
};

export default useSearchParameters;
