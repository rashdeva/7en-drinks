import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "./command";
import { Command as CommandPrimitive } from "cmdk";
import {
  useState,
  useRef,
  useCallback,
  type KeyboardEvent,
  useEffect,
} from "react";
import { Check, Loader2, XCircle } from "lucide-react"; // Import the X icon
import { capitalizeFirstLetter, cn } from "~/lib/utils";

export type Option = Record<"value" | "label", string> & Record<string, string>;

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
  value?: Option;
  onValueChange?: (value: Option) => void;
  onChange?: (value: KeyboardEvent<HTMLInputElement>) => void;
  onValueAdd?: (value: Option) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  allowAddNew?: boolean;
};

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onChange,
  onValueChange,
  onValueAdd,
  disabled,
  isLoading = false,
  allowAddNew = false,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | undefined>(value as Option);
  const [inputValue, setInputValue] = useState<string>(value?.label || "");
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;

      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find(
          (option) => option.label === input.value
        );
        if (optionToSelect) {
          setSelected(optionToSelect);
          onValueChange?.(optionToSelect);
        } else if (allowAddNew) {
          const newOption = {
            value: capitalizeFirstLetter(input.value),
            label: capitalizeFirstLetter(input.value),
          };
          setSelected(newOption);
          onValueAdd?.(newOption);
          onValueChange?.(newOption);
        }
        setOpen(false);
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options, onValueChange, onValueAdd, allowAddNew]
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue(selected?.label || "");
  }, [selected, setInputValue]);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label);

      setSelected(selectedOption);
      onValueChange?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange]
  );

  useEffect(() => {
    if (value) {
      setSelected(value);
      setInputValue(value?.label || "");
    }
  }, [value]);

  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  const hasOption = options.find((o: any) => o.label === inputValue);

  const handleClearInput = () => {
    setInputValue("");
    setSelected(undefined);
    onValueChange?.(undefined as unknown as Option);
    inputRef.current?.focus();
  };

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div className="relative">
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onKeyUp={onChange}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base pr-8" // Add padding to the right to accommodate the reset button
        />
        {isLoading ? (
          <CommandPrimitive.Loading>
            <Loader2 className="animate-spin w-5 h-5 absolute top-3.5 right-4" />
          </CommandPrimitive.Loading>
        ) : (
          inputValue && (
            <button
              type="button"
              onClick={handleClearInput}
              className="absolute top-3.5 right-4 opacity-50 hover:opacity-100"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )
        )}
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            "animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-card outline-none activeList",
            isOpen ? "block" : "hidden"
          )}
          
        >
          <CommandList className="rounded-lg ring-1 ring-slate-200 dark:ring-slate-600" ref={listRef}>
            {options.length > 0 && !isLoading ? (
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected?.value === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn(
                        "flex w-full items-center gap-2",
                        !isSelected ? "pl-8" : null
                      )}
                    >
                      {isSelected ? <Check className="w-4" /> : null}
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            {!isLoading && inputValue !== "" && !hasOption && allowAddNew ? (
              <CommandGroup>
                <CommandItem
                  value={inputValue}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onSelect={() =>
                    handleSelectOption({
                      value: capitalizeFirstLetter(inputValue),
                      label: capitalizeFirstLetter(inputValue),
                    })
                  }
                  className="flex w-full items-center gap-2 pl-8"
                >
                  Add "{inputValue}"
                </CommandItem>
              </CommandGroup>
            ) : null}
            {!isLoading && inputValue === "" ? (
              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
