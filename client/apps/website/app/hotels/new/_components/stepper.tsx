import StepperComp, {
  StepperProps as StepperCompProps,
} from "@ui/components/custom/stepper";

interface StepperProps extends Pick<StepperCompProps, "current"> {}

const steps = ["Create Hotel", "Create Rooms"];

export default function Stepper({ current }: StepperProps) {
  return <StepperComp steps={steps} current={current} className=" my-4" />;
}
