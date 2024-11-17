import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DisabledCardProps {
    className?: string;
    disabled?: boolean;
    children: React.ReactNode;
}

export function DisabledCard(props: DisabledCardProps) {
    return (
        <Card
            className={cn(
                props.className,
                props.disabled &&
                    "opacity-50 cursor-not-allowed pointer-events-none"
            )}
            {...props}>
            {props.children}
        </Card>
    );
}
