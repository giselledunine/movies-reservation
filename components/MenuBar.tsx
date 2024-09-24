"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "@/components/ModeToggle";
import { AvatarIcon } from "@/components/AvatarIcon";
interface User {
    id: number;
    name: string;
    email: string;
}

export default function MenuBar() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    console.log(pathname);

    const fetchUser = async () => {
        const data = {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
        };
        // const response = await fetch("/api/user");
        // const data = await response.json();
        setUser(data);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="flex items-center justify-between w-full p-4 fixed top-0 left-0 z-0">
            <div className="flex items-center gap-4 w-full justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <AvatarIcon user={user} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mx-4">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => router.push("/my-account")}>
                            Mon compte
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => router.push("/theatre-management")}>
                            Gestion du cinéma
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => router.push("/my-reservations")}>
                            Mes réservations
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-500">
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <ModeToggle />
            </div>
        </div>
    );
}
