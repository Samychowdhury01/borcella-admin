"use client";
import { X } from "lucide-react";
import ReactSelect, {
  type MultiValueProps,
  type Props as ReactSelectProps,
  type GroupBase,
} from "react-select";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type Option = {
  label: string;
  value: string;
};

export type MultiSelectProps = Omit<
  ReactSelectProps<Option, true, GroupBase<Option>>,
  "options"
> & {
  options: Option[];
  onChange?: (selectedOptions: Option[]) => void;
  value?: Option[];
  placeholder?: string;
  className?: string;
  badgeClassName?: string;
  disabled?: boolean;
};

const MultiValue = (
  props: MultiValueProps<Option, true, GroupBase<Option>>
) => {
  return (
    <Badge
      variant="secondary"
      className="mr-1  py-0 pl-2 pr-1 text-xs font-normal"
    >
      {props.data.label}
      <span
        {...props.removeProps}
        className="ml-1 cursor-pointer rounded-sm pl-1 hover:bg-muted"
      >
        <X className="h-3 w-3" />
      </span>
    </Badge>
  );
};

export function MultiSelect({
  options,
  onChange,
  value,
  placeholder = "Select options...",
  className,
  disabled = false,
  ...props
}: MultiSelectProps) {
  return (
    <ReactSelect<Option, true, GroupBase<Option>>
      isMulti
      options={options}
      value={value}
      onChange={(selectedOptions) => {
        onChange?.(selectedOptions as Option[]);
      }}
      placeholder={placeholder}
      isDisabled={disabled}
      unstyled
      components={{
        MultiValue,
        ...props.components,
      }}
      classNames={{
        control: ({ isFocused }) =>
          cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isFocused ? "ring-2 ring-ring ring-offset-2" : "",
            disabled && "cursor-not-allowed opacity-50",
            className
          ),
        placeholder: () => "text-muted-foreground",
        input: () => "text-foreground",
        valueContainer: () => "flex flex-wrap gap-1",
        menu: () =>
          cn(
            "mt-2 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md z-50"
          ),
        menuList: () => "p-1",
        option: ({ isFocused, isSelected }) =>
          cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
            isFocused && "bg-accent text-accent-foreground",
            isSelected && "bg-primary text-primary-foreground"
          ),
        noOptionsMessage: () => "text-muted-foreground p-2 text-sm",
        ...props.classNames,
      }}
      {...props}
    />
  );
}
