import { Row } from "@tanstack/react-table";
import { ITableRoom } from "./types";

interface IAmount {
  row: Row<ITableRoom>;
}

export default function Amount({ row }: IAmount) {
  const amount = parseFloat(row.getValue("price"));
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return <div className="text-center font-medium">{formatted}</div>;
}
