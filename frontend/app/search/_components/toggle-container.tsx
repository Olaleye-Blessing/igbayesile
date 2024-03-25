import React, { PropsWithChildren, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface ToggleContainerProps extends PropsWithChildren {
  className?: string;
  title: string;
  parentClassName?: string;
  parentChildClassName?: string;
}

export default function ToggleContainer({
  className,
  title,
  children,
  parentClassName,
  parentChildClassName,
}: ToggleContainerProps) {
  const divContRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn(["cardboard shadow-sm md:p-0", className])}>
      <button
        type="button"
        className="py-1 px-2 w-full text-left flex items-center justify-between md:hidden"
        onClick={() => {
          const { current: container } = divContRef;
          if (!container) return;

          container.classList.toggle("open-container");
        }}
      >
        {title}
        <span>
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>
      <div
        ref={divContRef}
        className={cn([
          "grid grid-rows-[0fr] duration-200 transition-[grid-template-rows] md:grid-rows-[1fr]",
          parentClassName,
        ])}
      >
        <div className={cn("overflow-hidden", parentChildClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
