import { ReactNode } from "react";
import { cn } from "~/lib/utils";
import LogoPng from "~/assets/sun.svg";
import { Link } from "react-router-dom";

export const ProfileLayout = ({
  children,
  className,
  rootClassName,
}: {
  children: ReactNode;
  className?: string;
  rootClassName?: string;
}) => {
  return (
    <>
      <div className={cn("container max-w-lg")}>
        <div className={cn("flex flex-col min-h-dvh py-4", rootClassName)}>
          <div className={cn("flex-1", className)}>{children}</div>
          <Link className="flex items-center justify-center w-full gap-2" to={"/"}>
            <img src={LogoPng} className="h-5 w-5 animate-spin-slow" alt="" />
            <span className="font-bold text-xs">YASWAMI</span>
          </Link>
        </div>
      </div>
    </>
  );
};
