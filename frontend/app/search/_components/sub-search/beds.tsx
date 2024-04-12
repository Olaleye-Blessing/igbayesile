import { FormField } from "@/components/custom/form-field";
import { UseFormReturn } from "react-hook-form";
import { SearchData } from "../../_types";

interface BedProps {
  form: UseFormReturn<SearchData, any, undefined>;
}

export default function Beds({ form }: BedProps) {
  return (
    <section>
      <h3>Number of beds</h3>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          input={{
            ...form.register("beds.gte"),
            type: "number",
            min: 1,
          }}
          label="Minimum"
        />
        <FormField
          input={{
            ...form.register("beds.lte"),
            type: "number",
            min: 1,
          }}
          label="Maximum"
        />
      </div>
    </section>
  );
}
