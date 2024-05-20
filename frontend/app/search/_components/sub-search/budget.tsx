import { FormField } from "@/components/custom/form-field";
import { UseFormReturn } from "react-hook-form";
import { SearchData } from "../../_types";
import { useDebouncedField } from "../../_hooks/use-debounced-field";

interface BudgetProps {
  form: UseFormReturn<SearchData, any, undefined>;
}

export default function Budget({ form }: BudgetProps) {
  const { handleSearchChange } = useDebouncedField();

  return (
    <section>
      <h3>Your budget per 24 hours</h3>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          input={{
            ...form.register("price.gte"),
            type: "number",
            min: 0,
            onChange: (e) => {
              handleSearchChange("minPrice", e.target.value);
            },
          }}
          label="Minimum"
        />
        <FormField
          input={{
            ...form.register("price.lte"),
            type: "number",
            min: 0,
            onChange: (e) => {
              handleSearchChange("maxPrice", e.target.value);
            },
          }}
          label="Maximum"
        />
      </div>
    </section>
  );
}
