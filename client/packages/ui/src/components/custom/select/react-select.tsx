import Select, { Props as SelectProps } from "react-select";
import { classNames } from "./styles";

interface ReactSelectProps extends SelectProps {}

export default function ReactSelect(props: ReactSelectProps) {
  return <Select {...props} classNames={classNames} />;
}
