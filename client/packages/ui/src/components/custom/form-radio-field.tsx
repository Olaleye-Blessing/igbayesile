"use client";

import { forwardRef, ReactNode } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem, RadioGroupProps } from "../ui/radio-group";

interface FormRadioFieldProps {
  label: string;
  options: {
    label?: ReactNode;
    id: string;
    value: string;
  }[];
  labelClassName?: string;
  errMsg?: string;
  radioGroup?: RadioGroupProps;
  required?: boolean;
}

const FormRadioField = forwardRef<HTMLInputElement, FormRadioFieldProps>(
  (
    {
      label,
      options,
      errMsg,
      required = false,
      labelClassName = "",
      radioGroup = {},
    },
    ref,
  ) => {
    return (
      <div>
        <Label
          className={labelClassName}
          required={required}
          aria-required={required}
        >
          {label}
        </Label>
        <RadioGroup {...radioGroup} ref={ref}>
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.id} />
              <Label htmlFor={option.id}>{option.label || option.value}</Label>
            </div>
          ))}
        </RadioGroup>
        {errMsg && <p className="text-red-600 text-sm text-left">{errMsg}</p>}
      </div>
    );
  },
);

FormRadioField.displayName = "FormRadioField";

export { FormRadioField };
