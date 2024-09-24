import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";
import MenuBar from "@/components/MenuBar";
import Title from "@/components/Title";
import { Toaster } from "@/components/ui/toaster";
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
                        <>
                            <MenuBar />
                            <Title>MOVIES</Title>
                            {children}
                            <Toaster />
                        </>
                    </ThemeProvider>
                </body>
            </html>
        </>
    );
}
