import { cn } from "~/lib/utils";

export const Coins = ({
  value,
  className,
  disablePlus,
}: {
  value: number;
  className?: string;
  disablePlus?: boolean;
}) => {
  // Format value with commas for thousands separator
  const formattedValue = value.toLocaleString();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-white font-semibold",
        className
      )}
    >
      {!disablePlus && "+"}
      {formattedValue} <span className="text-xl">🥤</span>
    </span>
  );
};
