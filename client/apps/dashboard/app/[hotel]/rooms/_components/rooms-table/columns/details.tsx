import { Row } from "@tanstack/react-table";
import { ITableRoom } from "./types";
import Link from "next/link";
import { usePagePath } from "@dashboard/hooks/use-page-path";

interface IActions {
  row: Row<ITableRoom>;
}

export default function Details({ row }: IActions) {
  const room = row.original;
  const { getHotelId } = usePagePath();
  const roomLink = `/${getHotelId()}/rooms/${room._id}`;

  return (
    <Link href={roomLink} className="text-primary font-semibold underline">
      View room
    </Link>
  );
}
