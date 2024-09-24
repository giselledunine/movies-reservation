"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { format } from "date-fns";

//components
import { DatePicker } from "@/components/DatePicker";
import { SeatPicker } from "@/components/SeatPicker";
//shadcn ui
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DisabledCard from "@/components/DiscabledCard";
interface Movie {
    movie_id: number;
    movie_title: string;
    genre_name: string;
    monday_showtimes: string[];
    movie_poster: string;
}

type KeysEndingWithShowtimes<T> = {
    [K in keyof T as K extends `${string}_showtimes` ? K : never]: number;
};

function MovieSchedule({ date, movie }: { date: Date; movie: Movie }) {
    const dayOfWeek: string = format(date, "eeee").toLowerCase();
    const dayOfWeekShowtimes: string = `${dayOfWeek}_showtimes`;
    const showtimesByDay: string[] =
        movie[dayOfWeekShowtimes as keyof KeysEndingWithShowtimes<Movie>];
    console.table(showtimesByDay);

    const displayHours = () => {
        if (!showtimesByDay) {
            return <p>No showtimes</p>;
        }

        const currentHour = format(new Date().getTime(), "HHmm");
        console.log("currenthour", typeof currentHour);

        return showtimesByDay.map((showtime: string, index: number) => (
            <SeatPicker
                // disabled={showtime.replace(":", "") < currentHour}
                showtime={showtime}
                key={index}>
                {showtime}
            </SeatPicker>
        ));
    };

    return (
        <DisabledCard
            disabled={!showtimesByDay}
            className="w-[100%]"
            key={movie.movie_id}>
            <CardHeader>
                <div className="flex gap-2 justify-between">
                    <div>
                        <CardTitle className=" text-2xl">
                            {movie.movie_title}
                        </CardTitle>
                        <CardDescription>{movie.genre_name}</CardDescription>
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
                <h3 className="text-md font-semibold">Horraires</h3>
                <div className="flex gap-2 flex-wrap">{displayHours()}</div>
            </CardContent>
        </DisabledCard>
    );
}

export default function Home() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [moviesDisplay, setMoviesDisplay] = useState<Movie[]>([]);
    const [date, setDate] = useState<Date>(new Date());
    // const router = useRouter();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        const response = await fetch("/api/movies");
        const data = await response.json();
        setMovies(data);
        setMoviesDisplay(data);
    };

    const handleSearch = (search: string) => {
        const filteredMovies = movies.filter((movie) =>
            movie.movie_title.toLowerCase().includes(search.toLowerCase())
        );
        setMoviesDisplay(filteredMovies);
    };

    const moviesWithShowtimes = () => {
        const dayOfWeek: string = format(date, "eeee").toLowerCase();
        const dayOfWeekShowtimes: string = `${dayOfWeek}_showtimes`;
        const moviesWithShowtimes = movies.filter((movie) =>
            movie[dayOfWeekShowtimes as keyof KeysEndingWithShowtimes<Movie>]
                ? true
                : false
        );
        return moviesWithShowtimes ? moviesWithShowtimes.length : 0;
    };

    return (
        <div className="grid grid-rows-[1fr_40px] items-start justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)] mt-40">
            <main className="z-20 flex flex-col gap-4 row-start-1 items-start w-full sm:w-fit sm:items-start p-4">
                <div className="flex w-full items-start gap-2 md:flex-row flex-col">
                    <Input
                        type="movie"
                        placeholder="Nom du film"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <DatePicker date={date} setDate={setDate} />
                </div>
                <div className="rounded-xl border bg-primary text-primary-foreground w-full p-4">
                    {moviesWithShowtimes() === 0 ? (
                        "Aucun film disponible à cette date"
                    ) : (
                        <span>
                            <b>{moviesWithShowtimes()}</b> film
                            {moviesWithShowtimes() > 1 ? "s sont" : " est"}{" "}
                            disponible
                            {moviesWithShowtimes() > 1 ? "s" : ""} à cette date
                        </span>
                    )}
                </div>
                <div className="w-full flex flex-col gap-4">
                    {movies
                        ? moviesDisplay.map((movie) => (
                              <MovieSchedule
                                  key={movie.movie_id}
                                  date={date}
                                  movie={movie}
                              />
                          ))
                        : Array.from({ length: 2 }).map((_, index) => (
                              <Skeleton
                                  key={index}
                                  className="h-[278px] w-full rounded-xl"
                              />
                          ))}
                </div>
            </main>
            <footer className="row-start-2 flex gap-6 flex-wrap items-center justify-center">
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
