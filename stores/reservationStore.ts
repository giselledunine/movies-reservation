import { create } from "zustand";
import {
    fetchReservations,
    deleteReservation,
    createReservation,
} from "@/requests/reservationRequests";
import { Prisma, Reservation } from "@prisma/client";

export type ReservationWithMovieAndShowtimes = Prisma.ReservationGetPayload<{
    include: {
        movie: true;
        showtime: true;
    };
}>;

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

interface ReservationState {
    reservations: ReservationWithMovieAndShowtimes[];
    getReservations: () => Promise<ReservationWithMovieAndShowtimes[]>;
    getReservationsByUserId: (
        user_id: number
    ) => Promise<ReservationWithMovieAndShowtimes[]>;
    removeReservation: (reservation_id: number) => Promise<void>;
    addReservation: (
        datas: Prisma.ReservationUncheckedCreateInput
    ) => Promise<Reservation>;
}

export const useReservationStore = create<ReservationState>((set) => ({
    reservations: [],
    getReservations: async () => {
        const reservations = await fetchReservations(
            1,
            "reservations_by_user_id"
        );
        set(() => ({ reservations }));
        return reservations;
    },
    getReservationsByUserId: async (user_id) => {
        const reservations = await fetchReservations(
            user_id,
            "reservations_by_user_id"
        );
        set(() => ({ reservations }));
        return reservations;
    },
    removeReservation: async (reservation_id) => {
        return await deleteReservation(reservation_id)
            .then((res) => {
                set(({ reservations }) => ({
                    reservations: reservations.filter(
                        (reserv) => reserv.movie_id !== reservation_id
                    ),
                }));
                return res;
            })
            .catch((err) => err);
    },
    addReservation: async (datas) => {
        return await createReservation(datas)
            .then((res) => {
                if (res) {
                    set(({ reservations }) => ({
                        reservations: [res, ...reservations],
                    }));
                    return res;
                }
            })
            .catch((err) => err);
    },
}));
