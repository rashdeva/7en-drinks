import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
      {formattedValue} {t("points")}
    </span>
  );
};
