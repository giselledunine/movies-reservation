// import { create } from "zustand";
// import { fetchShowtimes } from "@/requests/showtimeRequests";
// import { Prisma, Showtime } from "@prisma/client";

// export type MovieWithGenreAndShowtimes = Prisma.MovieGetPayload<{
//     include: {
//         genre: true;
//         showtimes: true;
//     };
// }>;

// type ReplaceType<T, K extends keyof T, NewType> = Omit<T, K> & {
//     [P in K]: NewType;
// };

// export type AddMovieType = ReplaceType<
//     Prisma.MovieCreateInput,
//     "movie_poster",
//     File
// > & {
//     genre_id: number;
// };

// interface MovieState {
//     showtimes: Showtime[];
//     getShowtimes: (movie_id) => Promise<Showtime[]>;
// }

// export const useMovieStore = create<MovieState>((set, get) => ({
//     showtimes: [],
//     getShowtimes: async (movie_id) => {
//         const showtimes = await fetchShowtimes(movie_id);
//         set(() => ({ showtimes }));
//         return showtimes;
//     },
}));
