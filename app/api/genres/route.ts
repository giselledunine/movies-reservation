import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    // const createGenre = async () =>
    //     await prisma.genre.create({
    //         data: {
    //             genre_name: "Enfants",
    //         },
    //     });

    // createGenre();
    try {
        const movies = await prisma.genre.findMany();
        return NextResponse.json(movies);
    } catch (error) {
        return NextResponse.error();
    }
}
