import { ColumnDef } from "@tanstack/react-table";
import { ITableRoom } from "./types";
import Images from "./images";
import Amount from "./amount";
import Amenities from "./amenities";
import Actions from "./actions";
import Details from "./details";

export const columns: ColumnDef<ITableRoom>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div className="font-bold">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => <Images row={row} />,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Price</div>,
    cell: ({ row }) => <Amount row={row} />,
  },
  {
    accessorKey: "numberOfBeds",
    header: () => "Beds",
  },
  {
    accessorKey: "amenities",
    header: "Amenities",
    cell: ({ row }) => <Amenities row={row} />,
  },
  {
    id: "details",
    cell: ({ row }) => <Details row={row} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];
