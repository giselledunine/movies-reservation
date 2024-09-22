import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
    id: number;
    name: string;
    email: string;
}

export function AvatarIcon({ user }: { user: User | null }) {
    return (
        <Avatar>
            {user ? (
                <AvatarImage
                    src="https://firebasestorage.googleapis.com/v0/b/random-90ee8.appspot.com/o/PP-min.png?alt=media&token=6fe5f731-f25a-404e-862f-4f0f4ebbfa0d"
                    alt="@giselledunine"
                />
            ) : (
                <AvatarFallback>CN</AvatarFallback>
            )}
        </Avatar>
    );
}
