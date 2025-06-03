import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";
import { Category } from "../category";

interface CategoryCheckboxProps {
  item: any;
  form: any;
  name: string;
}

export const CategoryCheckbox: React.FC<CategoryCheckboxProps> = ({
  item,
  form,
  name,
}) => {
  return (
    <FormField
      key={item.id}
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem
            key={item.id}
            className={cn(
              "bg-background shadow-md rounded-lg flex flex-row items-start space-x-3 space-y-0 border hover:shadow-lg",
              field.value?.includes(item.id) &&
                "border-primary shadow-none bg-card hover:shadow-none"
            )}
          >
            <FormLabel className="flex items-center justify-center text-base normal-case w-full h-20 p-2 font-medium text-center text-foreground cursor-pointer">
              <FormControl className="">
                <Checkbox
                  checked={field.value?.includes(item.id)}
                  className="hidden"
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange([...field.value, item.id])
                      : field.onChange(
                          field.value?.filter(
                            (value: string) => value !== item.id
                          )
                        );
                  }}
                />
              </FormControl>
              <Category>{item.i18n}</Category>
            </FormLabel>
          </FormItem>
        );
      }}
    />
  );
};
