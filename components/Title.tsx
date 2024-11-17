"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
export default function Title({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [scrollingDown, setScrollingDown] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleScroll = () => {
        setScrollingDown(true);
    };

    return (
        <div className="flex items-center justify-center w-fit mx-auto z-2 fixed top-0 left-[50%] -translate-x-1/2">
            <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="h-fit p-4 hover:bg-transparent">
                <h1
                    className={cn(
                        "transition-all duration-300 font-extrabold normal font-thunder text-5xl sm:text-9xl md:text-9xl lg:text-9xl text-center",
                        pathname !== "/" &&
                            "transition-all duration-300 text-5xl md:text-5xl lg:text-5xl",
                        scrollingDown &&
                            "text-5xl md:text-5xl lg:text-5xl opacity-50 z-0"
                    )}
                    style={{
                        textRendering: "geometricPrecision",
                    }}>
                    {children}
                </h1>
            </Button>
        </div>
    );
}
