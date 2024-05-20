import { FormField } from "@/components/custom/form-field";
import { UseFormReturn } from "react-hook-form";
import { SearchData } from "../../_types";
import { useDebouncedField } from "../../_hooks/use-debounced-field";

interface BedProps {
  form: UseFormReturn<SearchData, any, undefined>;
}

export default function Beds({ form }: BedProps) {
  const { handleSearchChange } = useDebouncedField();

  return (
    <section>
      <h3>Number of beds</h3>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          input={{
            ...form.register("beds.gte"),
            type: "number",
            min: 1,
            onChange: (e) => {
              handleSearchChange("minBeds", e.target.value);
            },
          }}
          label="Minimum"
        />
        <FormField
          input={{
            ...form.register("beds.lte"),
            type: "number",
            min: 1,
            onChange: (e) => {
              handleSearchChange("maxBeds", e.target.value);
            },
          }}
          label="Maximum"
        />
      </div>
    </section>
  );
}
