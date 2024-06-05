import { usePathname, useRouter } from "next/navigation";

type TAction = "push" | "replace" | "normal";

const hotelIdRegExp = /^(?:\/)([a-zA-Z0-9]+)\//; // Capture hotel ID

export const usePagePath = () => {
  const pathname = usePathname();
  const router = useRouter();

  const getHotelId = () => {
    const match = pathname.match(hotelIdRegExp);

    if (!match) return null;

    return match[0].slice(1).slice(0, -1);
  };

  const updatePagePath = ({
    newPath,
    action = "push",
    scroll = false,
  }: {
    newPath: string;
    action?: TAction;
    scroll?: boolean;
  }) => {
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

  return { updateHotelPath, updatePagePath, getHotelId };
};
