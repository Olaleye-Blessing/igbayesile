import { FormField } from "@/components/custom/form-field";
import { UseFormReturn } from "react-hook-form";
import { SearchData } from "../../_types";

interface BudgetProps {
  form: UseFormReturn<SearchData, any, undefined>;
}

export default function Budget({ form }: BudgetProps) {
  return (
    <section>
      <h3>Your budget per 24 hours</h3>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          input={{
            ...form.register("price.gte"),
            type: "number",
            min: 0,
          }}
          label="Minimum"
        />
        <FormField
          input={{
            ...form.register("price.lte"),
            type: "number",
            min: 0,
          }}
          label="Maximum"
        />
      </div>
    </section>
  );
}
