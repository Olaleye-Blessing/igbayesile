"use client";

import { forwardRef, ReactNode } from "react";
import { Input, InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputWithIcon } from "./input-with-icon";
import { cn } from "@/lib/utils";
import { InputPassword } from "./input-password";

export interface FormFieldProps {
  errMsg?: string;
  label?: string;
  Icon?: ReactNode;
  input: InputProps;
  labelClassName?: string;
  className?: string;
  required?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      errMsg,
      label,
      labelClassName,
      required = false,
      className,
      Icon = undefined,
      input,
    },
    ref,
  ) => {
    const props: InputProps = {
      ...input,
      "aria-required": required,
      id: input.id || input.name,
    };

    return (
      <div className={cn(["mb-3", className])}>
        <Label
          htmlFor={input.id || input.name}
          className={cn("capitalize", labelClassName)}
          required={required}
        >
          {label || input.name}
        </Label>
        {input.type === "password" ? (
          <InputPassword {...input} ref={ref} {...props} />
        ) : Icon ? (
          <InputWithIcon Icon={Icon} ref={ref} {...props} />
        ) : (
          <Input ref={ref} {...props} />
        )}
        {errMsg && <p className="text-red-600 text-sm text-left">{errMsg}</p>}
      </div>
    );
  },
);

FormField.displayName = "FormField";

export { FormField };
