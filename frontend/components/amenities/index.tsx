import Loading from "@/app/loading";
import { useIGBQuery } from "@/hooks/use-igb-query";
import { IAmenity } from "@/interfaces/amenity";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import Amenity from "./amenity";
import { cn } from "@/lib/utils";

type AmenitiesForm = {
  mode: "form";
  onSelect: (checked: boolean, amenity: IAmenity) => void;
  defaultChecks?: string[];
};

type AmenitiesList = {
  mode: "list";
  onSelect?: never;
  defaultChecks?: never;
};

type AmenitiesProps = (AmenitiesForm | AmenitiesList) & {
  target: IAmenity["target"];
  className?: string;
};

let url = `/amenities?limit=${50}`;

export default function Amenities({
  target,
  mode,
  onSelect,
  defaultChecks = [],
  className,
}: AmenitiesProps) {
  if (target !== "both") url += `&target=${target}`;

  const { data, error, isFetching } = useIGBQuery<{
    results: IAmenity[];
  }>({
    url,
    options: {
      queryKey: ["amenities", { target }],
    },
  });

  return (
    <>
      {data ? (
        <ul
          className={cn(
            "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3",
            className,
          )}
        >
          {data.results.map((amenity) => {
            return (
              <li key={amenity._id} className="flex items-center justify-start">
                {mode === "form" ? (
                  <>
                    <Checkbox
                      id={amenity._id}
                      className="mr-2"
                      defaultChecked={defaultChecks?.includes(amenity._id)}
                      onCheckedChange={(checked) =>
                        onSelect(checked as boolean, amenity)
                      }
                    />
                    <Label
                      htmlFor={amenity._id}
                      className="flex items-center justify-start [&>span]:flex [&>span]:items-center [&>span]:justify-start"
                    >
                      <Amenity amenity={amenity} />
                    </Label>
                  </>
                ) : (
                  <p className="flex items-center justify-start">
                    <Amenity amenity={amenity} />
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      ) : isFetching ? (
        <Loading />
      ) : error ? (
        <p className="error">{error.message}</p>
      ) : null}
    </>
  );
}
