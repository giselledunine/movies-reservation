"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { UserWithRoleSession } from "@/lib/authOptions";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOutIcon, User, Table2, Home, Play, Ticket } from "lucide-react";

import { ModeToggle } from "@/components/ModeToggle";
import { AvatarIcon } from "@/components/AvatarIcon";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useUserStore } from "@/stores/userStore";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";

export default function MenuBar() {
    const router = useRouter();
    const pathname = usePathname();
    const storeSession = useUserStore((state) => state.session);
    const { setSession } = useUserStore((state) => state);
    const session = useSession();
    const [isTop, setIsTop] = useState<boolean>(true);
    const sessionWithRole = storeSession as UserWithRoleSession;

    useEffect(() => {
        if (session.data && !storeSession) {
            setSession(session.data as UserWithRoleSession);
        }
    }),
        [session];

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setIsTop(true);
            } else {
                setIsTop(false);
            }
        };
        document.addEventListener("scroll", handleScroll);
        return window.removeEventListener("scroll", handleScroll);
    }),
        [];

    return (
        <div className="flex bg-background z-50 items-center justify-between w-full p-4 fixed top-0 left-0 z-0">
            <div className="flex items-center gap-4 w-full justify-between">
                <div>
                    {storeSession ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <AvatarIcon session={sessionWithRole} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mx-4">
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => router.push("/account")}>
                                        <User />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() =>
                                            router.push("/reservations")
                                        }>
                                        <Table2 />
                                        Mes réservations
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>

                                <DropdownMenuGroup>
                                    {sessionWithRole?.user?.role ===
                                        "admin" && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>
                                                Gestion du cinéma
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    router.push(
                                                        "/management/theatre"
                                                    )
                                                }>
                                                <Home />
                                                Les salles
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    router.push(
                                                        "/management/movies"
                                                    )
                                                }>
                                                <Play />
                                                Les films
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    router.push(
                                                        "/management/showtimes"
                                                    )
                                                }>
                                                <Ticket />
                                                Les séances
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="cursor-pointer text-red-500">
                                    <LogOutIcon />
                                    Déconnexion
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : session.status === "loading" ? (
                        <Skeleton className="h-10 w-10 rounded-full" />
                    ) : (
                        <>
                            <Button
                                className="mr-4"
                                onClick={() => router.push("/login")}
                                variant="outline">
                                Sign In
                            </Button>
                            <Button variant="default">Sign Up</Button>
                        </>
                    )}
                </div>
                <Image
                    onClick={() => router.push("/")}
                    src={"/logo-movies.png"}
                    alt={"logo"}
                    className={`dark:invert transition-all ease-in-out absolute left-[50%] -translate-x-[50%] top-0 hover:cursor-pointer ${
                        isTop && pathname == "/" ? "sm:w-[200px]" : "w-[112px]"
                    }`}
                    width={112}
                    height={50}
                />
                <ModeToggle />
            </div>
        </div>
    );
}
