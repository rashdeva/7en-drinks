import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";
import { useHapticFeedback } from "@telegram-apps/sdk-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-muted bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-card-foreground hover:text-accent-foreground",
        link: "text-foreground underline-offset-4 uppercase",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-9 px-3 text-base font-bold",
        lg: "h-14 text-lg px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const haptic = useHapticFeedback();

    const handleClick = React.useCallback(
      (event: any) => {
        haptic.impactOccurred("light");
        onClick && onClick(event as any);
      },
      [onClick]
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
