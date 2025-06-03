import * as React from "react";

import { cn } from "~/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number | readonly string[] | undefined;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border-2 border-input bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={value ?? ""} // Ensure the value is not null
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

interface AdornedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: string;
  urlPattern?: RegExp; // Add the urlPattern prop
}

const AdornedInput = React.forwardRef<HTMLInputElement, AdornedInputProps>(
  ({ startAdornment, urlPattern, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target as HTMLInputElement;
      let value = input.value;
      if (urlPattern) {
        value = value.replace(urlPattern, "");
      }
      input.value = value;
      if (props.onChange) {
        // Manually create a change event
        const changeEvent = new Event("input", {
          bubbles: true,
        }) as unknown as React.ChangeEvent<HTMLInputElement>;
        Object.defineProperty(changeEvent, "target", {
          writable: false,
          value: input,
        });
        Object.defineProperty(changeEvent, "currentTarget", {
          writable: false,
          value: input,
        });
        props.onChange(changeEvent);
      }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pastedText = event.clipboardData.getData("text");
      const input = event.target as HTMLInputElement;
      let value = pastedText;
      if (urlPattern) {
        value = pastedText.replace(urlPattern, "");
      }
      input.value = value;
      if (props.onChange) {
        // Manually create a change event
        const changeEvent = new Event("input", {
          bubbles: true,
        }) as unknown as React.ChangeEvent<HTMLInputElement>;
        Object.defineProperty(changeEvent, "target", {
          writable: false,
          value: input,
        });
        Object.defineProperty(changeEvent, "currentTarget", {
          writable: false,
          value: input,
        });
        props.onChange(changeEvent);
      }
    };

    return (
      <label
        className={`flex items-center border-2 border-input rounded-md ring-offset-background ${
          isFocused
            ? "outline-none border-primary"
            : "border-input"
        }`}
      >
        <span className="px-3 text-muted-foreground select-none">
          {startAdornment}
        </span>
        <div className="flex-1 overflow-hidden rounded-md">
          <Input
            ref={ref}
            {...props}
            className="flex-1 border-none pl-0 ring-0 focus:border-none focus-visible:ring-0 focus-visible:border-none focus:outline-0 focus-visible:shadow-none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onPaste={handlePaste}
            onInput={handleValueChange} // Listen for input events
            onChange={handleValueChange} // Listen for change events
          />
        </div>
      </label>
    );
  }
);

AdornedInput.displayName = "AdornedInput";

export { Input, AdornedInput };
