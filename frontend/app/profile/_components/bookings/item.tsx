import { LucideIcon } from "lucide-react";

interface ItemProps {
  label: string;
  Icon: LucideIcon;
  value: string | number;
}

export default function Item(props: ItemProps) {
  return (
    <p className="flex items-start justify-start">
      <span className="mr-0.5 mt-1 text-primary">
        <props.Icon className="w-5 h-4" />
      </span>
      <span className="font-semibold mr-1">{props.label}:</span>
      <span className="short-label mt-0.5">{props.value}</span>
    </p>
  );
}
