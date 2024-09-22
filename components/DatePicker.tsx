"use client";

import { useEffect } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function DatePicker({
    date,
    setDate,
}: {
    date: Date | undefined;
    setDate: (date: Date) => void;
}) {
    useEffect(() => {
        console.log("date", format(date as Date, "eeee"));
    }, [date]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate: Date | undefined) =>
                        selectedDate && setDate(selectedDate)
                    }
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
