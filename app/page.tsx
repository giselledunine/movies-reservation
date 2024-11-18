"use client";

import Image from "next/image";
import Fuse from "fuse.js";
import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
//components
import { DatePicker } from "@/components/DatePicker";
import { SeatPicker } from "@/components/SeatPicker";
//shadcn ui
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import { DisabledCard } from "@/components/DiscabledCard";
import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Prisma } from "@prisma/client";
import { MovieWithGenreAndShowtimes, useMovieStore } from "@/stores/movieStore";
import { useUserStore } from "@/stores/userStore";
import { useSession } from "next-auth/react";

type Criteria = {
    date?: Date;
    genre: number;
    query: string;
};

export default function Home() {
    const { movies, getMovies, getGenres, genres } = useMovieStore(
        (state) => state
    );
    const [moviesDisplay, setMoviesDisplay] = useState<
        MovieWithGenreAndShowtimes[]
    >([]);
    const [criteria, setCriteria] = useState<Criteria>({
        date: new Date(),
        genre: 0,
        query: "",
    });
    const session = useSession();

    const filterMovies = useCallback(
        (movies: MovieWithGenreAndShowtimes[], criteria: Criteria) => {
            const options = {
                includeScore: true, // Include score in the results
                keys: ["movie_title"], // The key to search in
                threshold: 0.4, // Lower threshold for more accurate matching
            };
            const fuse = new Fuse(movies, options);
            const filtered = movies.filter((movie) => {
                let filterDate;
                let filterGenre;
                let filterQuery;
                for (const key in criteria) {
                    switch (key) {
                        case "date":
                            if (criteria[key]) {
                                filterDate = movie.showtimes.find(
                                    (showtime) =>
                                        format(
                                            new Date(showtime.show_date),
                                            "dd/MM/yyyy"
                                        ) ==
                                        format(
                                            new Date(criteria[key] as Date),
                                            "dd/MM/yyyy"
                                        )
                                );
                            } else {
                                filterDate = true;
                            }
                            break;
                        case "genre":
                            filterGenre =
                                criteria[key] === 0
                                    ? true
                                    : movie.genres.find(
                                          (genre) =>
                                              genre.genre_id === criteria[key]
                                      );
                            break;
                        case "query":
                            if (criteria[key].length > 0) {
                                const filteredMovies = fuse
                                    .search(criteria[key])
                                    .map((result) => result.item);
                                filterQuery = filteredMovies.find(
                                    (filteredMovie) =>
                                        filteredMovie.movie_id ===
                                        movie.movie_id
                                );
                            } else {
                                filterQuery = true;
                            }
                        default:
                            break;
                    }
                }
                if (filterDate && filterGenre && filterQuery) {
                    return true;
                } else {
                    return false;
                }
            });
            setMoviesDisplay(filtered);
        },
        []
    );

    useEffect(() => {
        if (genres.length === 0) {
            getGenres();
        }
    });

    useEffect(() => {
        if (movies.length === 0) {
            getMovies();
        }
        if (movies && movies.length > 0) {
            filterMovies(movies, criteria);
        }
    }, [movies, getMovies, criteria, filterMovies]);

    const setQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const query = (e.target as HTMLInputElement).value;
        if (e.key === "Enter") {
            if (query === "") {
                setCriteria(() => ({
                    date: new Date(),
                    genre: 0,
                    query,
                }));
            } else {
                setCriteria(() => ({
                    date: undefined,
                    genre: 0,
                    query,
                }));
            }
        }
    };

    const MovieSchedule = ({
        movie,
        date,
    }: {
        movie: MovieWithGenreAndShowtimes;
        date?: Date;
    }) => {
        useEffect(() => {
            if (document.querySelectorAll(".card")) {
                gsap.registerPlugin(CustomEase);
                gsap.registerPlugin(ScrollTrigger);
                gsap.fromTo(
                    document.querySelectorAll(".card"),
                    {
                        opacity: 0,
                        y: 100,
                        scrollTrigger: ".card",
                    }, // Starting state
                    {
                        opacity: 1,
                        y: 0,
                        duration: 2.5,
                        ease: "elastic.out(1,0.6)",

                        stagger: 0.2, // Delay between each element (in seconds)
                    }
                );
            }
            // Check if the ref is set before animating
        }, []);

        const showtimesDisplayed =
            date &&
            movie.showtimes
                ?.filter(
                    (showtime: { show_date: Date }) =>
                        new Date(showtime.show_date).getDate() ==
                        new Date(date).getDate()
                )
                .sort(
                    (a, b) =>
                        new Date(a.show_date).getTime() -
                        new Date(b.show_date).getTime()
                );

        const displayHours = () => {
            if (showtimesDisplayed?.length === 0) {
                return <p>No showtimes for this date</p>;
            }

            return (
                showtimesDisplayed && (
                    <>
                        <h3 className="text-md font-medium">Horraires</h3>
                        <div className="flex flex-wrap gap-2">
                            {showtimesDisplayed?.map(
                                (
                                    showtime: Prisma.ShowtimeGetPayload<{
                                        include: { theater: true };
                                    }>,
                                    index: number
                                ) => (
                                    <SeatPicker
                                        disabled={
                                            new Date(
                                                showtime.show_date
                                            ).getTime() < new Date().getTime()
                                        }
                                        movie_id={movie.movie_id}
                                        user_id={session?.data?.user?.user_id}
                                        showtime={showtime}
                                        rows={showtime.theater.rows}
                                        seatsPerRow={showtime.theater.columns}
                                        key={index}>
                                        {format(
                                            new Date(showtime.show_date),
                                            "HH:mm"
                                        )}
                                    </SeatPicker>
                                )
                            )}
                        </div>
                    </>
                )
            );
        };

        return (
            <DisabledCard
                className="w-full sm:w-[350px] card"
                key={movie.movie_id}>
                <CardHeader>
                    <div className="flex gap-2 justify-between">
                        <div>
                            <CardTitle className="text-2xl">
                                {movie.movie_title}
                            </CardTitle>
                            <CardDescription>
                                {movie.genres
                                    .map((genre) => genre.genre_name)
                                    .join(", ")}
                            </CardDescription>
                        </div>
                        {movie.movie_poster ? (
                            <Image
                                className="rounded-xl"
                                src={movie.movie_poster}
                                alt={movie.movie_title}
                                width={100}
                                height={150}
                            />
                        ) : (
                            <Skeleton className="h-[125px] w-[95px] rounded-xl" />
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 flex-col">{displayHours()}</div>
                </CardContent>
            </DisabledCard>
        );
    };

    MovieSchedule.displayName = "MovieSchedule";

    return (
        <>
            <main className="z-20 flex flex-col gap-4 row-start-2 w-full justify-center items-center p-4">
                <div className="flex flex-col gap-2 w-full sm:w-fit">
                    <div className="border-input border rounded-md flex items-center pr-1">
                        <Input
                            className="border-none"
                            type="movie"
                            placeholder="Nom du film"
                            onKeyDown={(e) => setQuery(e)}
                        />
                        {/* <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="m-1 p-1 w-6 h-6"
                            onClick={() => {
                                setCriteria((prev) => ({
                                    ...prev,
                                    query: "",
                                }));
                            }}>
                            <Cross1Icon />
                        </Button> */}
                    </div>

                    <div className="flex gap-2 flex-col sm:flex-row">
                        <DatePicker
                            date={criteria.date}
                            setDate={(date) =>
                                setCriteria((prev) => ({ ...prev, date }))
                            }
                        />
                        <Select
                            value={criteria.genre?.toString()}
                            onValueChange={(genre) =>
                                setCriteria((prev) => ({
                                    ...prev,
                                    genre: Number(genre),
                                }))
                            }>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Genre" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Genres</SelectLabel>
                                    <SelectItem key={"0"} value={"0"}>
                                        Tous
                                    </SelectItem>
                                    {genres.map((genre) => (
                                        <SelectItem
                                            key={genre.genre_id}
                                            value={genre.genre_id.toString()}>
                                            {genre.genre_name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={() =>
                                setCriteria({
                                    genre: 0,
                                    date: undefined,
                                    query: "",
                                })
                            }>
                            Tous les films
                        </Button>
                    </div>
                </div>

                {/* <div className="rounded-xl border bg-primary text-primary-foreground w-full p-4">
                    {moviesWithShowtimes() === 0 ? (
                        "Aucun film disponible à cette date"
                    ) : (
                        <span className="font-normal">
                            <b>{moviesWithShowtimes()}</b> film
                            {moviesWithShowtimes() > 1 ? "s sont" : " est"}{" "}
                            disponible
                            {moviesWithShowtimes() > 1 ? "s" : ""} à cette date
                        </span>
                    )}
                </div> */}
                <div className="w-full flex flex-wrap gap-4 justify-center">
                    {movies ? (
                        moviesDisplay.length > 0 ? (
                            moviesDisplay.map((movie) => (
                                <MovieSchedule
                                    key={movie.movie_id}
                                    movie={movie}
                                    date={criteria.date}
                                />
                            ))
                        ) : (
                            <div>Pas de séances à cette date</div>
                        )
                    ) : (
                        Array.from({ length: 2 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-[250px] sm:h-[278px] w-full sm:w-[350px] rounded-xl"
                            />
                        ))
                    )}
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://github.com/giselledunine"
                    target="_blank"
                    rel="noopener noreferrer">
                    <GitHubLogoIcon />
                    Github
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://www.linkedin.com/in/sophia-hmamouche/"
                    target="_blank"
                    rel="noopener noreferrer">
                    <LinkedInLogoIcon />
                    Linkedin
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://www.behance.net/sophiahmamouche"
                    target="_blank"
                    rel="noopener noreferrer">
                    <Image
                        aria-hidden
                        src="/behance.png"
                        alt="Behance icon"
                        className="dark:invert"
                        width={15}
                        height={15}
                    />
                    Behance
                </a>
            </footer>
        </>
    );
}
