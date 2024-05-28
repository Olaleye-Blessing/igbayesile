import { ClassNamesConfig, GroupBase } from "react-select";

export const classNames: ClassNamesConfig<
  unknown,
  boolean,
  GroupBase<unknown>
> = {
  control: () => {
    return "!rounded-md !border !border-input !bg-background !text-sm !shadow-sm !transition-colors";
  },
  input: () => {
    return "!text-foreground";
  },
  placeholder: () => {
    return "!text-foreground";
  },
  singleValue: () => {
    return "!text-foreground";
  },
  option: (state) => {
    let val = state.isDisabled ? "!cursor-not-allowed" : "!cursor-pointer";
    if (state.isSelected) {
      val += " !bg-primary";
    } else {
      val += " !bg-background";
    }

    if (state.isFocused && !state.isSelected) val += " !bg-accent";

    return val;
  },
  menu: () => "!border !border-input !bg-background",
};
