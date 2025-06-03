import { ChevronsUpDown, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import ruCities from "./cities_ru.json";
import enCities from "./cities_en.json";

interface SelectCityProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export const SelectCity: React.FC<SelectCityProps> = ({
  value,
  label,
  onChange,
}) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState(
    i18n.language === "ru" ? ruCities.cities : enCities.cities
  );

  useEffect(() => {
    setCities(i18n.language === "ru" ? ruCities.cities : enCities.cities);
  }, [i18n.language]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {value || label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={t("Search for a city...")} />
          <CommandEmpty>{t("No city found.")}</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {cities.map((city: string) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === city ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {city}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
