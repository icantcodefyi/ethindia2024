import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BlockInputProps {
  input: {
    type: "number" | "text" | "address" | "select";
    label: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
    unit?: string;
  };
  value: string;
  onChange: (value: string) => void;
}

const BlockInput: React.FC<BlockInputProps> = ({ input, value, onChange }) => {
  const baseStyles = cn(
    "w-full bg-white border-2 border-black rounded-lg",
    "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
    "hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-[-2px]",
    "focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-y-[-2px]",
    "transition-all duration-200",
    "text-black font-medium placeholder:text-gray-500",
    "focus-visible:ring-0 focus-visible:ring-offset-0"
  );

  switch (input.type) {
    case "select":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            className={cn(
              baseStyles,
              "h-9 px-3",
              "data-[placeholder]:text-gray-500"
            )}
          >
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            {input.options?.map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="hover:bg-gray-100 font-medium cursor-pointer focus:bg-gray-100"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "number":
      return (
        <div className="relative">
          <Input
            type="number"
            placeholder={input.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(baseStyles, "h-9 px-3", input.unit ? "pr-10" : "")}
          />
          {input.unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm font-medium">
              {input.unit}
            </span>
          )}
        </div>
      );

    default:
      return (
        <Input
          type="text"
          placeholder={input.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(baseStyles, "h-9 px-3")}
        />
      );
  }
};

export default BlockInput;
