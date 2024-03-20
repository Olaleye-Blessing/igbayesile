import React, { ReactNode } from "react";
import { Input, InputProps } from "../ui/input";

interface InputWithIconProps extends InputProps {
  Icon: ReactNode;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ Icon, ...input }, ref) => {
    return (
      <div className="relative">
        <Input ref={ref} {...input} />
        <span className="form-icon absolute right-2 top-1/2 -translate-y-1/2">
          {Icon}
        </span>
      </div>
    );
  },
);

InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };
