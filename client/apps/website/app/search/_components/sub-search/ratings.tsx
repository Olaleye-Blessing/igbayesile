import RatingStar from "@ui/components/custom/rating-star";
import { SearchData } from "../../_types";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormRadioField } from "@ui/components/custom/form-radio-field";
import useSearchParameters from "@website/hooks/use-search-parameters";

interface RatingsProps {
  form: UseFormReturn<SearchData, any, undefined>;
}

const ratings = [4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0].map((rate) => ({
  id: `${rate}`,
  value: `${rate}`,
  label: (
    <span className="flex items-center justify-start">
      <RatingStar rating={rate} className="mr-1" />
      <span className="font-light">{rate} & up</span>
    </span>
  ),
}));

export default function Ratings({ form }: RatingsProps) {
  const { updateParams, deleteParams } = useSearchParameters();

  return (
    <section>
      <h3>Ratings</h3>
      <div className="max-h-[8.55rem] overflow-y-auto">
        <Controller
          name="ratings"
          control={form.control}
          render={({ field }) => (
            <FormRadioField
              label="Search by this only:"
              labelClassName="sr-only"
              options={ratings}
              radioGroup={{
                className: "capitalize space-y-1",
                onValueChange: (ratings) => {
                  const rating = Number(ratings);
                  field.onChange(ratings);

                  rating === 0
                    ? deleteParams(["ratings"], "push")
                    : updateParams({ ratings }, "push");
                },
                name: "ratings",
                value: form.watch("ratings") || "",
                defaultValue: "",
              }}
            />
          )}
        />
      </div>
    </section>
  );
}
