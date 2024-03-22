import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Step from "./step";
import Connector from "./connector";

export interface StepperProps {
  steps: ReactNode[];
  current: number;
  onNext?: (next: number) => number;
  className?: string;
}

export default function Stepper({ steps, current, className }: StepperProps) {
  const totalSteps = steps.length;

  return (
    <div
      className={cn([
        "stepper flex items-start justify-center max-w-[40rem] mx-auto",
        className,
      ])}
    >
      {steps.map((step, index) => {
        const active = current === index;

        return (
          <span
            key={index}
            className="step flex flex-col items-center justify-center w-full disabled:cursor-not-allowed"
          >
            <span
              className={cn([
                "flex items-center justify-center w-full",
                (index === 0 || index === totalSteps - 1) && " max-w-[50%]",
                index === 0 && "ml-auto",
                index === totalSteps - 1 && "mr-auto",
              ])}
            >
              {index > 0 && (
                <Connector index={index} current={current} type="left" />
              )}
              <Step index={index} current={current} />
              {index < totalSteps - 1 && (
                <Connector index={index} current={current} type="right" />
              )}
            </span>
            <span className={`${active ? "font-semibold" : ""}`}>{step}</span>
          </span>
        );
      })}
    </div>
  );
}
