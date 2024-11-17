import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";
import MenuBar from "@/components/MenuBar";

import { Toaster } from "@/components/ui/toaster";
import SessionWrapper from "@/lib/SessionWrapper";
type RootLayoutProps = {
    children: ReactNode;
};

export const metadata: Metadata = {
    title: "Movie Reservation",
    description: "Resreve your movie tickets",
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <SessionWrapper>
            <html lang="en" suppressHydrationWarning>
                <head />
                <body>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange>
                        <>
                            <MenuBar />
                            <div className="grid grid-rows-[72px_1fr_40px] items-start justify-items-center min-h-screen gap-4 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
                                {children}
                            </div>
                            <Toaster />
                        </>
                    </ThemeProvider>
                </body>
            </html>
        </SessionWrapper>
    );
}
