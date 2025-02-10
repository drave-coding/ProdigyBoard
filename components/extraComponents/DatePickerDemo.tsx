"use client";

import * as React from "react";
import {  format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange: (range: DateRange) => void; // Accept onDateChange prop
  selectedRange?: DateRange; // Add selectedRange as an optional prop
}

export function DatePickerWithRange({
  className,
  onDateChange,
  selectedRange, // Accept selectedRange prop
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(selectedRange); // Initialize with selectedRange if available

  // Whenever the selectedRange prop changes, update the local state
  React.useEffect(() => {
    if (selectedRange !== undefined) {
      setDate(selectedRange);
    }
  }, [selectedRange]);

  const handleDateChange: SelectRangeEventHandler = (range) => {
    if (range && range.from && range.to) { // Ensure range is defined
      setDate(range); // Update local state
      onDateChange(range); // Call the onDateChange prop with the new range
    } else {
      setDate(range); // Update state even if it's not a complete range
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || new Date()} // Default to today if date is undefined
            selected={date}
            onSelect={handleDateChange} // Use the new handler
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
