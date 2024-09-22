"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import { format } from "date-fns";

//components
import { ModeToggle } from "@/components/ModeToggle";
import { DatePicker } from "@/components/DatePicker";
import { AvatarIcon } from "@/components/AvatarIcon";

//shadcn ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
interface Movie {
    movie_id: number;
    movie_title: string;
    genre_name: string;
    monday_showtimes: string[];
    movie_poster: string;
}

type KeysEndingWithId<T> = {
    [K in keyof T as K extends `${string}Id` ? K : never]: number;
};

interface User {
    id: number;
    name: string;
    email: string;
}

function MovieSchedule({ date, movie }: { date: Date; movie: Movie }) {
    const dayOfWeek: string = format(date, "eeee").toLowerCase();
    const dayOfWeekShowtimes: string = `${dayOfWeek}_showtimes`;
    const moviesByDay: string[] =
        movie[dayOfWeekShowtimes as keyof KeysEndingWithId<Movie>];
    console.table(moviesByDay);

    return (
        <div className="flex gap-2 flex-wrap">
            {moviesByDay ? (
                moviesByDay.map((showtime: string, index: number) => (
                    <Button key={index}>{showtime}</Button>
                ))
            ) : (
                <p>No showtimes</p>
            )}
        </div>
    );
}

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [moviesDisplay, setMoviesDisplay] = useState<Movie[]>([]);
    const [date, setDate] = useState<Date>(new Date());

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
            movie.movie_title.toLowerCase().includes(search.toLowerCase())
        );
        setMoviesDisplay(filteredMovies);
    };

    return (
        <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
            <header className="flex row-start-1 items-center justify-between w-full">
                <div className="flex items-center justify-between w-full p-4">
                    <ModeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <AvatarIcon user={user} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mx-4">
                            <DropdownMenuItem className="cursor-pointer">
                                Mon compte
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                Mes réservations
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-500">
                                Déconnexion
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-extrabold lg:text-5xl font-[Thunder]">
                    Movies Rerservation
                </h1>
                <div className="flex w-full items-center space-x-2 md:flex-row flex-col">
                    <Input
                        type="movie"
                        placeholder="Nom du film"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <DatePicker date={date} setDate={setDate} />
                </div>
                <div className="w-full flex flex-col gap-4">
                    {moviesDisplay.map((movie) => (
                        <Card className="w-[100%]" key={movie.movie_id}>
                            <CardHeader>
                                <div className="flex gap-2 justify-between">
                                    <div>
                                        <CardTitle className=" text-2xl">
                                            {movie.movie_title}
                                        </CardTitle>
                                        <CardDescription>
                                            {movie.genre_name}
                                        </CardDescription>
                                    </div>
                                    {movie.movie_poster ? (
                                        <Image
                                            className="rounded-xl"
                                            src={movie.movie_poster}
                                            alt={movie.movie_title}
                                            width={100}
                                            height={100}
                                        />
                                    ) : (
                                        <Skeleton className="h-[125px] w-[95px] rounded-xl" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <h3 className="text-md font-semibold">
                                    Horraires
                                </h3>
                                <MovieSchedule date={date} movie={movie} />
                            </CardContent>
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
