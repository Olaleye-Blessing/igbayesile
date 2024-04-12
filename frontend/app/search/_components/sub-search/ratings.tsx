import RatingStar from "@/components/custom/rating-star";
import { SearchData } from "../../_types";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormRadioField } from "@/components/custom/form-radio-field";

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
                onValueChange: field.onChange,
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
