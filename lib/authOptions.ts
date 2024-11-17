import { NextAuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";

export type UserWithRoleSession = Session & {
    expires: Date;
    user: {
        role?: string | null;
        user_id?: number | null;
    };
};

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    // cookies: {
    //     sessionToken: {
    //         name: `__Secure-next-auth.session-token`,
    //         options: {
    //             httpOnly: true,
    //             sameSite: "lax",
    //             path: "/",
    //             secure: process.env.NODE_ENV === "production",
    //         },
    //     },
    // },
    providers: [
        GithubProvider({
            clientId: process.env.AUTH_GITHUB_ID as string,
            clientSecret: process.env.AUTH_GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        // ...add more providers here
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            // Exemple : Vérifier si l'utilisateur appartient à une organisation GitHub spécifique
            // console.log({
            //     NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            //     GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
            //     GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
            // });
            if (account?.provider === "github") {
                const prismaUser = await prisma.user.findUnique({
                    where: {
                        email: user.email as string, // `email` must be a unique field in your schema
                    },
                });
                const whiteList: string[] = process.env.WHITELIST
                    ? (process.env.WHITELIST.split(",") as string[])
                    : [];
                const isWhiteListed = whiteList.includes(user.email as string);
                if (!prismaUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email as string,
                            name: user.name as string,
                            role: isWhiteListed ? "admin" : "user",
                        },
                    });
                } else {
                    if (prismaUser.role === "user" && isWhiteListed) {
                        await prisma.user.update({
                            where: {
                                user_id: prismaUser.user_id,
                            },
                            data: {
                                role: "admin",
                            },
                        });
                    } else if (prismaUser.role === "admin" && !isWhiteListed) {
                        await prisma.user.update({
                            where: {
                                user_id: prismaUser.user_id,
                            },
                            data: {
                                role: "user",
                            },
                        });
                    }
                }
            } else if (account?.provider === "google") {
                const prismaUser = await prisma.user.findUnique({
                    where: {
                        email: user.email as string, // `email` must be a unique field in your schema
                    },
                });
                const whiteList: string[] = process.env.WHITELIST
                    ? (process.env.WHITELIST.split(",") as string[])
                    : [];
                const isWhiteListed = whiteList.includes(user.email as string);
                if (!prismaUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email as string,
                            name: user.name as string,
                            role: isWhiteListed ? "admin" : "user",
                        },
                    });
                } else {
                    if (prismaUser.role === "user" && isWhiteListed) {
                        await prisma.user.update({
                            where: {
                                user_id: prismaUser.user_id,
                            },
                            data: {
                                role: "admin",
                            },
                        });
                    } else if (prismaUser.role === "admin" && !isWhiteListed) {
                        await prisma.user.update({
                            where: {
                                user_id: prismaUser.user_id,
                            },
                            data: {
                                role: "user",
                            },
                        });
                    }
                }
            }
            return true;
        },
        async session({ session }) {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user?.email as string,
                },
            });
            const userWithRoleSession = session as UserWithRoleSession;
            // Ajouter le rôle à la session pour qu'il soit accessible côté client
            if (userWithRoleSession.user && user) {
                userWithRoleSession.user.role = user.role;
                userWithRoleSession.user.user_id = user.user_id;
            }
            return userWithRoleSession;
        },
        async jwt({ token }) {
            const user = await prisma.user.findUnique({
                where: {
                    email: token.email as string,
                },
            });
            if (user) {
                token.role = user.role;
                token.user_id = user.user_id;
            }
            return token;
        },
    },
};
