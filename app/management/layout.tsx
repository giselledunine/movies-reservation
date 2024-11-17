"use client";

import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Play, Ticket } from "lucide-react";
type RootLayoutProps = {
    children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
    const pathname = usePathname();
    return (
        <div className="grid grid-cols-[1fr] sm:grid-cols-[1fr_5fr] row-start-2 sm:gap-4 w-full sm:w-[80%] p-4 sm:p-none">
            <div className="col-start-1 hidden sm:flex flex-col items-end">
                <div className="w-full border flex  flex-col rounded-lg font-light">
                    <Link href="/management/theatre">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start rounded-b-none",
                                pathname === "/management/theatre" &&
                                    "bg-primary text-primary-foreground"
                            )}>
                            <Home />
                            Salles
                        </Button>
                    </Link>
                    <Separator />
                    <Link href="/management/movies">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start rounded-none",
                                pathname === "/management/movies" &&
                                    "bg-primary text-primary-foreground"
                            )}>
                            <Play />
                            Films
                        </Button>
                    </Link>
                    <Separator />
                    <Link href="/management/showtimes">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start rounded-t-none",
                                pathname === "/management/showtimes" &&
                                    "bg-primary text-primary-foreground"
                            )}>
                            <Ticket />
                            Séances
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="col-start-1 sm:col-start-2 flex flex-col ">
                {children}
            </div>
        </div>
    );
}
