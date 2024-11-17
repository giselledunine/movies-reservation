import { create } from "zustand";
import {
    fetchTheaters,
    removeTheater,
    addTheater,
    updateTheater,
} from "@/requests/theaterRequests";
import { Theater, Prisma } from "@prisma/client";

export interface Datas {
    theater: Prisma.TheaterCreateInput;
    theater_id?: number;
}

interface TheaterState {
    theaters: Theater[];
    getTheaters: () => void;
    removeTheater: (theater_id: number) => Promise<any>;
    addTheater: (datas: Datas) => Promise<any>;
    updateTheater: (datas: Datas) => Promise<any>;
}

export const useTheatreStore = create<TheaterState>((set, get) => ({
    theaters: [],
    getTheaters: async () => {
        const theaters = await fetchTheaters();
        theaters.sort(
            (a: Theater, b: Theater) => a.room_number - b.room_number
        );
        set(() => ({ theaters }));
    },
    removeTheater: async (theater_id) => {
        return await removeTheater(theater_id)
            .then((res) => {
                set(({ theaters }) => ({
                    theaters: theaters.filter(
                        (theater) => theater.theater_id !== theater_id
                    ),
                }));
                return res;
            })
            .catch((err) => err);
    },
    addTheater: async (datas) => {
        await addTheater(datas)
            .then((res) => {
                set(({ theaters }) => ({
                    theaters: [...theaters, res],
                }));
                return res;
            })
            .catch((err) => err);
    },
    updateTheater: async (datas) => {
        const state = get();
        await updateTheater(datas).then((res) => {
            const theatersWithoutUpdated = state.theaters.filter(
                (theater) => theater.theater_id !== datas.theater_id
            );
            set(() => ({
                theaters: [...theatersWithoutUpdated, res],
            }));
        });
    },
}));
