"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

//shadcn ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Movie {
    id: number;
    title: string;
    description: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

function ModeToggle() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function DatePickerDemo() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        console.log("date", format(date as Date, "eeee"));
    }, [date]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

function AvatarDemo({ user }: { user: User | null }) {
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

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [moviesDisplay, setMoviesDisplay] = useState<Movie[]>([]);

    useEffect(() => {
        fetchUser();
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        const response = await fetch("/api/movies");
        const data = await response.json();
        setMovies(data);
        setMoviesDisplay(data);
    };

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

    const handleSearch = (search: string) => {
        const filteredMovies = movies.filter((movie) =>
            movie.title.toLowerCase().includes(search.toLowerCase())
        );
        setMoviesDisplay(filteredMovies);
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div className="flex items-center justify-between w-full">
                    <ModeToggle />
                    <AvatarDemo user={user} />
                </div>
                <h1 className="text-4xl font-extrabold lg:text-5xl">
                    Movies Rerservation
                </h1>
                <div className="flex w-full items-center space-x-2">
                    <Input
                        type="movie"
                        placeholder="Nom du film"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <DatePickerDemo />
                </div>
                <div className="w-full flex flex-col gap-4">
                    {moviesDisplay.map((movie) => (
                        <Card className="w-[100%]" key={movie.id}>
                            <CardHeader>
                                <div className="flex gap-2 justify-between">
                                    <div>
                                        <CardTitle className=" text-2xl">
                                            {movie.title}
                                        </CardTitle>
                                        <CardDescription>
                                            {movie.description}
                                        </CardDescription>
                                    </div>
                                    <Skeleton className="h-[125px] w-[95px] rounded-xl" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-md font-semibold">
                                    Horraires
                                </h3>
                            </CardContent>
                            <CardFooter></CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer">
                    <Image
                        aria-hidden
                        src="https://nextjs.org/icons/file.svg"
                        alt="File icon"
                        width={16}
                        height={16}
                    />
                    Learn
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer">
                    <Image
                        aria-hidden
                        src="https://nextjs.org/icons/window.svg"
                        alt="Window icon"
                        width={16}
                        height={16}
                    />
                    Examples
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer">
                    <Image
                        aria-hidden
                        src="https://nextjs.org/icons/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                    />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
}
