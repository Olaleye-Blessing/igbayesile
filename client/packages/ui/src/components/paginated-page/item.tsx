import { PropsWithChildren } from "react";
import { cn } from "@ui/lib/utils";
import { Button } from "../ui/button";

interface DotProps {
  type: "dot";
  children?: never;
  onClick?: never;
}

interface PageProps extends PropsWithChildren<{}> {
  type: "page";
  onClick: () => void;
}

type PaginationItemProps = (DotProps | PageProps) & {
  className?: string;
  disabled?: boolean;
};

export default function PaginationItem({
  type,
  ...props
}: PaginationItemProps) {
  return (
    <li className="h-8 w-8 rounded-full flex items-center justify-center">
      {type === "page" ? (
        <Button
          variant="ghost"
          onClick={props.onClick}
          className={cn(["w-full h-full rounded-full p-0", props.className])}
          disabled={props.disabled}
        >
          {props.children}
        </Button>
      ) : (
        <span className={props.className}>&#8230;</span>
      )}
    </li>
  );
}
