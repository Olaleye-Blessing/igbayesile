import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CircularProps {
  value: number;
  total: number;
  color: string;
}
export const Circular = ({ value, total, color }: CircularProps) => {
  const percentage = Math.floor((value / total) * 100);

  return (
    <div className="w-16 h-16">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          pathColor: color,
          // pathTransition
          pathTransitionDuration: 0.9,
        })}
      />
    </div>
  );
};
