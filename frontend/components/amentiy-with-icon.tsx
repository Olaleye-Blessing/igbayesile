import { Heater } from "lucide-react";

export default function AmentiyWithIcon({ amenity }: { amenity: string }) {
  return (
    <li className="flex items-start justify-start">
      <span className="mr-1">
        <Heater className="h-6 w-6 text-blue-600" />
      </span>
      <span className="text-sm">{amenity}</span>
    </li>
  );
}
