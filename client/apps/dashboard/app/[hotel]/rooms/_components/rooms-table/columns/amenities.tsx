import { Row } from "@tanstack/react-table";
import { ITableRoom } from "./types";
import { IAmenity } from "@ui/interfaces/amenity";

interface IAmenities {
  row: Row<ITableRoom>;
}

export default function Amenities({ row }: IAmenities) {
  const amenities: Array<IAmenity> = row.getValue("amenities");

  return (
    <ul className="amenities text-center font-medium max-h-36 overflow-y-auto">
      {amenities.map((amenity) => (
        <li key={amenity._id} className="amenity">
          <p
            className="flex items-center justify-start"
            title={amenity.tooltip}
          >
            <span className="material-symbols-outlined amenity__icon">
              {amenity.icon}
            </span>
            <span className="amenity__text">{amenity.label}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
