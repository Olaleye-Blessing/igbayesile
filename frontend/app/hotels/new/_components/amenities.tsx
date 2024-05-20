import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import AmenitiesComp from "@/components/amenities";
import { IAmenity } from "@/interfaces/amenity";
interface AmenitiesProps {
  form: UseFormReturn<any, any, undefined>;
  listClassName?: string;
  defaultChecks?: string[];
  target: IAmenity["target"];
  info: ReactNode;
  onChange?: (amenities: any[]) => void;
}

export default function Amenities({
  form,
  listClassName,
  defaultChecks,
  target,
  info,
  onChange,
}: AmenitiesProps) {
  const onSelectAmenity = (checked: boolean, amenity: IAmenity) => {
    let _amenities = [...form.getValues("amenities")];

    if (checked) {
      _amenities.push(amenity._id);
    } else {
      _amenities = _amenities.filter((am) => am !== amenity._id);
    }

    onChange?.(_amenities);
    form.setValue("amenities", _amenities);
  };

  return (
    <div>
      <p className="flex items-center justify-start mb-1 font-semibold">
        <span className="text-base">Amenities</span>
        <span className="text-gray-400 text-sm">{info}</span>
      </p>
      <AmenitiesComp
        target={target}
        mode="form"
        onSelect={onSelectAmenity}
        defaultChecks={defaultChecks}
        className={listClassName}
        limit={100}
      />
    </div>
  );
}
