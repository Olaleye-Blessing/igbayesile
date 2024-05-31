import { usePathname, useRouter } from "next/navigation";

type TAction = "push" | "replace" | "normal";

export const usePagePath = () => {
  const pathname = usePathname();
  const router = useRouter();

  const updatePagePath = ({
    newPath,
    action = "push",
    scroll = false,
  }: {
    newPath: string;
    action?: TAction;
    scroll?: boolean;
  }) => {
    const hotelIdRegExp = /^(?:\/)([a-zA-Z0-9]+)\//; // Capture hotel ID
    const match = pathname.match(hotelIdRegExp);

    if (!match) return act("/", action, scroll);

    return act(`/${match[1]}/${newPath}`, action, scroll);
  };

  const updateHotelPath = ({
    hotelId,
    action = "push",
    scroll = false,
  }: {
    hotelId: string;
    action?: TAction;
    scroll?: boolean;
  }) => {
    if (pathname === "/") return act(`/${hotelId}/dashboard`, action, scroll);

    const pagePath = pathname.replace(
      /^\/([a-zA-Z0-9]+)\/(.+)$/,
      `/${hotelId}/$2`,
    );

    act(pagePath, action, scroll);
  };

  function act(path: string, action: TAction, scroll = false) {
    if (action === "normal") return path;

    return router[action](path, { scroll });
  }

  return { updateHotelPath, updatePagePath };
};
