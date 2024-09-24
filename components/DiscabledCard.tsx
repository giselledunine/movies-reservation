import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DisabledCardProps extends React.ComponentProps<typeof Card> {
    disabled?: boolean;
    children: React.ReactNode;
}

export default function DisabledCard({
    disabled = false,
    className,
    children,
    ...props
}: DisabledCardProps) {
    return (
        <Card
            className={cn(
                className,
                disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
            {...props}>
            {children}
        </Card>
    );
}
