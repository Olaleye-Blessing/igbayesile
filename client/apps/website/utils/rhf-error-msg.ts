import { FieldValues, UseFormReturn } from "react-hook-form";

export function rhfErrMsg<T extends FieldValues>(
  key: keyof T,
  form: UseFormReturn<T, any, undefined>,
) {
  const error = form.formState.errors[key];

  if (!error) return;

  if (error.type === "required") return "Required";

  return error.message || "Configure this error message";
}
