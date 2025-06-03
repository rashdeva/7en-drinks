"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "~/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

const CircleProgress = ({
  size,
  radius,
  progress,
}: {
  size: number;
  radius: number;
  progress: number;
}) => {
  const width = `w-${size}`;
  const height = `h-${size}`;
  const circumference = Number((2 * Math.PI * radius).toFixed(1));
  const strokeDashOffset = circumference - (circumference * progress) / 100;

  return (
    <div className={`relative ${width} ${height}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-white stroke-current"
          strokeWidth="4"
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
        />

        <circle
          className="text-[#50CDFF]  progress-ring__circle stroke-current"
          strokeWidth="8"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={`${strokeDashOffset}px`}
          transform="rotate(-90 50 50)"
        />

      </svg>
    </div>
  );
};
CircleProgress.displayName = "CircleProgress";

export { Progress, CircleProgress };
