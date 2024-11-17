import { create } from "zustand";
import { User } from "@prisma/client";
import { UserWithRoleSession } from "@/lib/authOptions";

interface UserState {
    user: User | undefined;
    session: UserWithRoleSession | undefined;
    setSession: (session: UserWithRoleSession) => void;
    setUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: undefined,
    session: undefined,
    setSession: (session) => {
        set(() => ({
            session,
        }));
    },
    setUser: (user) => {
        set(() => ({
            user,
        }));
    },
}));
