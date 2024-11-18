import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SessionContextValue } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";

export function AvatarIcon({ session }: { session: SessionContextValue }) {
    return (
        <Avatar>
            {session.data?.user ? (
                <AvatarImage
                    src={session.data.user.image as string}
                    alt={session.data.user.image as string}
                />
            ) : (
                <Skeleton className="h-10 w-10 rounded-full" />
            )}
        </Avatar>
    );
}
