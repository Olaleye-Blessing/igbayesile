import { Check } from "lucide-react";

export interface StepProps {
  index: number;
  current: number;
}

export default function Step({ index, current }: StepProps) {
  return (
    <button
      className={`rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center ${index < current ? "bg-blue-500" : "bg-slate-300"}`}
      disabled={index > current}
    >
      {index < current ? (
        <Check size={16} className=" text-white" />
      ) : (
        <>{index}</>
      )}
    </button>
  );
}
