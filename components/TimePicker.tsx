"use client";

import React, { useState, useRef } from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
    date: Date;
    setDate: (date: Date) => void;
    className?: string;
    type?: string;
}

export function TimePicker({
    date,
    setDate,
    className,
    type,
}: TimePickerProps) {
    const minuteRef = useRef<HTMLButtonElement>(null);
    const hourRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    date && date.getHours() < 10 && date?.setHours(10);
    date?.setMinutes(0);

    // Use the provided date or create a new one if not provided
    const [internalDate, setInternalDate] = useState(date);

    const hours = Array.from({ length: 14 }, (_, i) => i + 10);
    const minutes =
        type === "half_minutes"
            ? Array.from({ length: 2 }, (_, i) => i * 30)
            : Array.from({ length: 60 }, (_, i) => i);

    const handleHourChange = (hour: string) => {
        const newDate = new Date(internalDate);
        newDate.setHours(parseInt(hour));
        setInternalDate(newDate);
        setDate(newDate);
    };

    const handleMinuteChange = (minute: string) => {
        const newDate = new Date(internalDate);
        newDate.setMinutes(parseInt(minute));
        setInternalDate(newDate);
        setDate(newDate);
    };

    const displayTime = () => {
        return internalDate?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}>
                    <Clock className="mr-2 h-4 w-4" />
                    {internalDate ? displayTime() : <span>Pick a time</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
                <div className="flex items-center justify-center p-2">
                    <div className="flex items-center justify-center space-x-2">
                        <Select
                            onValueChange={handleHourChange}
                            value={internalDate.getHours().toString()}>
                            <SelectTrigger ref={hourRef} className="w-[80px]">
                                <SelectValue placeholder="Hour" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                                {hours.map((hour) => (
                                    <SelectItem
                                        key={hour}
                                        value={hour.toString()}>
                                        {hour.toString().padStart(2, "0")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-xl">:</span>
                        <Select
                            onValueChange={handleMinuteChange}
                            value={internalDate.getMinutes().toString()}>
                            <SelectTrigger ref={minuteRef} className="w-[80px]">
                                <SelectValue placeholder="Minute" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                                {minutes.map((minute) => (
                                    <SelectItem
                                        key={minute}
                                        value={minute.toString()}>
                                        {minute.toString().padStart(2, "0")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
