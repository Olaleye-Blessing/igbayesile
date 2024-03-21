import { cn } from "@/lib/utils";

interface ConnectorProps {
  index: number;
  current: number;
  type: "left" | "right";
}

export default function Connector({ index, current, type }: ConnectorProps) {
  let active = false;
  if (type === "left") {
    active = index <= current;
  } else {
    active = index < current;
  }

  return (
    <>
      <span
        className={cn([
          "h-1 flex-grow flex-shrink-0 basis-8",
          active ? "bg-blue-500" : "bg-slate-300",
        ])}
      />
    </>
  );
}
