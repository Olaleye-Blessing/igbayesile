import { IAmenity } from "@/interfaces/amenity";

interface AmenityProps {
  amenity: IAmenity;
}

export default function Amenity({ amenity }: AmenityProps) {
  return (
    <>
      <span className="material-symbols-outlined amenity__icon text-[1.5rem] mr-1 text-gray-400">
        {amenity.icon}
      </span>
      <span className="text-lg pt-[0.05rem] amenity__text">
        {amenity.label}
      </span>
    </>
  );
}
