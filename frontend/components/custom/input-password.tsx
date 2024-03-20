"use client";

import { forwardRef, useState } from "react";
import { InputProps } from "../ui/input";
import { InputWithIcon } from "./input-with-icon";

const InputPassword = forwardRef<HTMLInputElement, InputProps>(
  ({ ...input }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword((prev) => !prev);

    return (
      <InputWithIcon
        {...input}
        ref={ref}
        type={showPassword ? "text" : "password"}
        Icon={
          <button type="button" onClick={togglePassword}>
            {/* TODO: Replace with icon when luicide icon is in the codebase */}
            {showPassword ? <>close</> : <>open</>}
          </button>
        }
      />
    );
  },
);

InputPassword.displayName = "InputPassword";

export { InputPassword };
