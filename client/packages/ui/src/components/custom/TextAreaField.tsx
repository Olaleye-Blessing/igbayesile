"use client";

import { forwardRef } from "react";
import { Textarea, TextareaProps } from "../ui/textarea";
import { FormFieldProps } from "./form-field";
import { Label } from "../ui/label";
import { cn } from "./../../lib/utils";

interface TextAreaFieldProps extends Omit<FormFieldProps, "input" | "Icon"> {
  textarea: TextareaProps;
}

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (
    { errMsg, label, labelClassName, required = false, className, textarea },
    ref,
  ) => {
    const props: TextareaProps = {
      ...textarea,
      "aria-required": required,
      id: textarea.id || textarea.name,
    };

    return (
      <div className={cn(["mb-3", className])}>
        <Label
          htmlFor={textarea.id || textarea.name}
          className={cn("capitalize", labelClassName)}
          required={required}
        >
          {label || textarea.name}
        </Label>
        <Textarea {...textarea} ref={ref} {...props} />
        {errMsg && <p className="text-red-600 text-sm text-left">{errMsg}</p>}
      </div>
    );
  },
);

TextAreaField.displayName = "TextAreaField";

export { TextAreaField };
