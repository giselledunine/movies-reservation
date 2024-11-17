import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DatePicker({
    date,
    setDate,
}: {
    date: Date | undefined;
    setDate: (date: Date) => void;
}) {
    const [open, setOpen] = useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full sm:w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate: Date | undefined) => {
                        selectedDate && setDate(selectedDate);
                        setOpen(false);
                    }}
                    disabled={(date) => date < subDays(new Date(), 1)}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
