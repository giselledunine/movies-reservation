import { create } from "zustand";
import {
    fetchMovies,
    fetchMovie,
    removeMovie,
    addMovie,
    updateMovie,
    fetchGenres,
} from "@/requests/movieRequests";
import { Genre, Prisma } from "@prisma/client";
import Cookies from "js-cookie";

export type MovieWithGenreAndShowtimes = Prisma.MovieGetPayload<{
    include: {
        genres: true;
        showtimes: {
            include: {
                theater: true;
            };
        };
    };
}>;

type ReplaceType<T, K extends keyof T, NewType> = Omit<T, K> & {
    [P in K]: NewType;
};

export type AddMovieType = ReplaceType<
    Prisma.MovieCreateInput,
    "movie_poster",
    File
> & {
    genres: number[];
};

export type UpdateMovieType = ReplaceType<
    Prisma.MovieUpdateInput,
    "movie_poster",
    File
> & {
    movie_id: number;
    genres: number[];
};

export type ErrorObject = {
    error: {
        message: string;
        err: Error;
    };
    status: number;
};

// export type UoMovieType = ReplaceType<
//     Prisma.MovieCreateInput,
//     "movie_poster",
//     File
// > & {
//     genre_id: number;
// };

interface MovieState {
    movies: MovieWithGenreAndShowtimes[];
    selectedMovie?: MovieWithGenreAndShowtimes;
    genres: Genre[];
    setSelectedMovie: (movie_id: number) => Promise<void>;
    getMovies: () => Promise<MovieWithGenreAndShowtimes[]>;
    getMovie: (movie_id: string) => Promise<void>;
    getGenres: () => Promise<Genre[]>;
    removeMovies: (movie_id: number) => Promise<void>;
    addMovie: (
        datas: AddMovieType
    ) => Promise<MovieWithGenreAndShowtimes | ErrorObject>;
    updateMovies: (
        datas: UpdateMovieType
    ) => Promise<MovieWithGenreAndShowtimes | ErrorObject>;
}

export const useMovieStore = create<MovieState>((set, get) => ({
    movies: [],
    genres: [],
    selectedMovie: undefined,
    setSelectedMovie: async (movie_id) => {
        set((prev) => ({
            ...prev,
            selectedMovie: prev?.movies?.find(
                (movie) => movie.movie_id === movie_id
            ),
        }));
        Cookies.set("movie_id", movie_id.toString());
    },
    getMovies: async () => {
        const movies = await fetchMovies();
        set(() => ({ movies }));
        return movies;
    },
    getMovie: async (movie_id: string) => {
        const refreshedMovie = await fetchMovie(movie_id);
        set(({ movies }) => {
            const replaced = movies?.map((movie) =>
                movie.movie_id === refreshedMovie.movie_id
                    ? refreshedMovie
                    : movie
            );
            return { movies: replaced };
        });
    },
    getGenres: async () => {
        return await fetchGenres().then((res: Genre[]) => {
            set(() => ({ genres: res }));
            return res;
        });
    },
    removeMovies: async (movie_id) => {
        return await removeMovie(movie_id)
            .then((res) => {
                set(({ movies }) => ({
                    movies: movies?.filter(
                        (movies) => movies.movie_id !== movie_id
                    ),
                }));
                return res;
            })
            .catch((err) => err);
    },
    addMovie: async (datas) => {
        return await addMovie(datas)
            .then((res) => {
                set(({ movies }) => ({
                    movies: movies && [...movies, res],
                }));
                return res;
            })
            .catch((err) => err);
    },
    updateMovies: async (datas) => {
        const state = get();
        return await updateMovie(datas).then((res) => {
            const moviesWithoutUpdated = state.movies?.filter(
                (movies) => movies.movie_id !== datas.movie_id
            );
            moviesWithoutUpdated &&
                set(() => ({
                    movies: [...moviesWithoutUpdated, res],
                }));
            return res;
        });
    },
}));
