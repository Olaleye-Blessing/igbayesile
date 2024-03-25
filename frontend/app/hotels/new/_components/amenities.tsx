import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

interface AmenitiesProps {
  form: UseFormReturn<any, any, undefined>;
  listClassName?: string;
  defaultChecks?: string[];
}

export default function Amenities({
  form,
  listClassName,
  defaultChecks,
}: AmenitiesProps) {
  return (
    <div>
      <Label className="flex flex-col mb-1">
        <span className="text-base">Amenities</span>(
        <span className="text-gray-400 text-sm">
          Choose as many as possible
        </span>
        )
      </Label>
      <ul
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3",
          listClassName,
        )}
      >
        {amenities.map((amenity) => {
          const id = amenity.replace(/\s/g, "-");

          return (
            <li key={id}>
              <Checkbox
                defaultChecked={defaultChecks?.includes(amenity)}
                id={id}
                className="mr-2"
                onCheckedChange={(checked) => {
                  let _amenities = [...form.getValues("amenities")];

                  if (checked) {
                    _amenities.push(amenity);
                  } else {
                    _amenities = _amenities.filter((am) => am !== amenity);
                  }

                  form.setValue("amenities", _amenities);
                }}
              />
              <Label htmlFor={id}>{amenity}</Label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const amenities = [
  "Free Wi-Fi",
  "Coffee and Tea Maker",
  "Mini Bar",
  "Hair Dryer",
  "Iron and Ironing Board",
  "Safe",
  "Swimming Pool",
  "Fitness Center",
  "Spa",
  "Restaurant and Bar",
  "Room Service",
  "Business services",
];
