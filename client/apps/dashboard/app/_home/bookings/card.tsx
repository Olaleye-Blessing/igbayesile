import { Circular } from "./circular";
import { IBookingData, IBookingKeys } from "./data";
import { colors, labels } from "./utils";

interface CardProps {
  id: IBookingKeys;
  data: IBookingData;
}

export default function Card({ id, data }: CardProps) {
  const label = labels[id];
  const value = data[id];
  const total = data.total;

  return (
    <li
      className="dash_cardboard flex items-center justify-between px-4 py-3 min-w-48 flex-1 border-0 border-l-4"
      style={{
        borderColor: colors[id],
      }}
    >
      <div className="font-semibold">
        <h3 className="text-xs text-muted-foreground">{label}</h3>
        <p className="text-lg">{value}</p>
      </div>
      <div>
        <Circular value={value} total={total} color={colors[id]} />
      </div>
    </li>
  );
}
