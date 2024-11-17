import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const showtimes = await prisma.showtime.findMany();
        return NextResponse.json(showtimes);
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(request: Request) {
    const {
        request_type,
        movie_id,
        theater_id,
        dates,
        available_seats,
    }: {
        request_type: "showtime" | null;
        movie_id: string;
        theater_id: string;
        dates: Date[];
        available_seats: number;
        showtime_id: number;
    } = await request.json();

    const addAllShowtimes = async (currentDate: Date) => {
        await prisma.showtime
            .create({
                data: {
                    movie_id: Number(movie_id),
                    theater_id: Number(theater_id),
                    show_date: new Date(currentDate),
                    available_seats,
                },
            })
            .catch(() => {});
    };

    if (request_type === "showtime") {
        try {
            const showtime = await prisma.showtime.findMany({
                where: {
                    showtime_id: Number(movie_id),
                },
                include: {
                    theater: true,
                },
            });
            return NextResponse.json(showtime);
        } catch (error) {
            return NextResponse.error();
        }
    } else {
        try {
            const showtime = dates.map((date) => addAllShowtimes(date));
            return NextResponse.json(showtime);
        } catch (error) {
            return NextResponse.error();
        }
    }
}

export async function DELETE(request: NextRequest) {
    const showtime_id = await request.json();
    return await prisma.showtime
        .delete({
            where: {
                showtime_id,
            },
        })
        .then((res) => NextResponse.json(res))
        .catch((err) => NextResponse.json(err));
}
