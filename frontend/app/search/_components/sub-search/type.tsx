import { Controller, UseFormReturn } from "react-hook-form";
import { SearchData } from "../../_types";
import { FormRadioField } from "@/components/custom/form-radio-field";

interface TypeProps {
  form: UseFormReturn<SearchData, any, undefined>;
}

const types = [
  {
    id: "hotels",
    value: "hotels",
  },
  {
    id: "rooms",
    value: "rooms",
  },
];

export default function Type({ form }: TypeProps) {
  return (
    <section>
      <h3 className="">Search Type</h3>
      <Controller
        name="type"
        control={form.control}
        render={({ field }) => (
          <FormRadioField
            label="Search by this only:"
            labelClassName="sr-only"
            options={types}
            radioGroup={{
              className: "capitalize space-y-1",
              onValueChange: field.onChange,
              name: "type",
              value: form.watch("type") || "",
              defaultValue: "hotels",
            }}
          />
        )}
      />
    </section>
  );
}
