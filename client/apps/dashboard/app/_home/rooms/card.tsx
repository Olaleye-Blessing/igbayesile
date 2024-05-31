interface CardProps {
  title: string;
  amount: number;
  total: number;
}

export default function Card({ title, amount, total }: CardProps) {
  console.log({ amount });
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1 mr-4">
        <h3 className="text-sm">{title}</h3>
        <div className="w-full bg-orange-500 h-2 rounded-sm relative">
          <span
            className="absolute top-0 left-0 rounded-sm bg-primary h-full"
            style={{
              width: `${(amount / total) * 100}%`,
            }}
          ></span>
        </div>
        <p className="text-xs font-semibold text-muted-foreground">
          Total of {total} rooms
        </p>
      </div>
      <p className="">{amount}</p>
    </div>
  );
}
