import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./ui/button";

type Seat = {
    id: string;
    row: number;
    number: number;
    status: "available" | "selected" | "taken";
};

export function Seat({
    seat,
    getButtonVariant,
    toggleSeat,
    full,
}: {
    seat: Seat;
    getButtonVariant: (status: Seat["status"]) => ButtonProps["variant"];
    toggleSeat: (id: string) => void;
    full: boolean;
}) {
    const getDisabled = (status: Seat["status"], full: boolean) => {
        if (status === "taken") {
            return true;
        } else if (status !== "selected" && full) {
            return true;
        } else {
            return false;
        }
    };
    return (
        <Button
            variant={getButtonVariant(seat.status)}
            onClick={() => toggleSeat(seat.id)}
            disabled={getDisabled(seat.status, full)}
            aria-label={`Row ${seat.row}, Seat ${seat.number}, ${seat.status}`}
            className={cn(
                "h-[20px] w-[20px] p-0",
                seat.status === "available" &&
                    "border-zinc-400 dark:border-zinc-500 border"
            )}></Button>
    );
}
