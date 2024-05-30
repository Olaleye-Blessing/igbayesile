"use client";

import { forwardRef, useState } from "react";
import { InputProps } from "../ui/input";
import { InputWithIcon } from "./input-with-icon";
import { Eye, EyeOff } from "lucide-react";

const InputPassword = forwardRef<HTMLInputElement, InputProps>(
  ({ ...input }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword((prev) => !prev);

    const ICon = showPassword ? EyeOff : Eye;

    return (
      <InputWithIcon
        {...input}
        ref={ref}
        type={showPassword ? "text" : "password"}
        Icon={
          <button type="button" onClick={togglePassword} className="mt-1">
            <ICon className="w-4 h-5" />
          </button>
        }
      />
    );
  },
);

InputPassword.displayName = "InputPassword";

export { InputPassword };
