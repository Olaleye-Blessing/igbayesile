import useSearchParameters from "@/hooks/use-search-parameters";
import { useDebouncedCallback } from "@react-hookz/web";

export const useDebouncedField = () => {
  const { updateParams, deleteParams, stringnify } = useSearchParameters();
  const handleSearchChange = useDebouncedCallback(
    (field: string, value: string) => {
      value
        ? updateParams({ [field]: value }, "push")
        : deleteParams([field], "push");
    },
    [stringnify()],
    1_500,
    500,
  );

  return { handleSearchChange };
};
