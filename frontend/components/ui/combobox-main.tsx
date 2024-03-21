"use client";

import { ReactNode, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ComboboxOption {
  value: string;
  label: ReactNode;
}

interface ComboboxMainProps {
  options: ComboboxOption[];
  triggerPlaceholder?: string;
  searchPlaceholder?: string;
  emptyMsg?: string;
  selectedValue?: string;
  onChange?: (currentValue: string) => void;
  className?: string;
  contentClassName?: string;
  scrollClassName?: string;
  disabled?: boolean;
}

export function ComboboxMain({
  options,
  triggerPlaceholder = "Select an option...",
  emptyMsg = "No option found.",
  searchPlaceholder = "Search for an option...",
  selectedValue = "",
  onChange,
  className,
  contentClassName,
  scrollClassName = "h-96",
  disabled = false,
}: ComboboxMainProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`${className} justify-between`}
          disabled={disabled}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : triggerPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(["w-60", contentClassName])}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMsg}</CommandEmpty>
            <ScrollArea className={scrollClassName}>
              <CommandGroup>
                {options.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);

                        onChange?.(currentValue);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
