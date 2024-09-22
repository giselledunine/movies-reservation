import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ToggleSheduleTimes({ showtimes }: { showtimes: string[] }) {
    return (
        <ToggleGroup type="multiple" variant="outline">
            {showtimes.map((showtime) => (
                <ToggleGroupItem
                    key={showtime}
                    value={showtime}
                    aria-label={showtime}>
                    {showtime}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}
