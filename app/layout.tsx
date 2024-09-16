import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";

type RootLayoutProps = {
    children: ReactNode;
};

export const metadata: Metadata = {
    title: "Movie Reservation",
    description: "Resreve your movie tickets",
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <>
            <html lang="en" suppressHydrationWarning>
                <head />
                <body>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange>
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </>
    );
}
