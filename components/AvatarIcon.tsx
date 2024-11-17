import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Session } from "next-auth";

export function AvatarIcon({ session }: { session?: Session }) {
    return (
        <Avatar>
            {session?.user ? (
                <AvatarImage
                    src={session?.user?.image as string}
                    alt={session?.user?.image as string}
                />
            ) : (
                <p>Image</p>
            )}
        </Avatar>
    );
}
