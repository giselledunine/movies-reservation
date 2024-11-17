import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const theatre = await prisma.theater.findMany();

        return NextResponse.json(theatre);
    } catch (error) {
        console.error("Error getting theatre room:", error);
        return NextResponse.error();
    }
}

export async function POST(request: NextRequest) {
    const { theater } = await request.json();
    try {
        const theatre = await prisma.theater.create({
            data: theater,
        });
        return NextResponse.json(theatre);
    } catch (error) {
        console.error("Error adding the theatre room:", error);
        return NextResponse.error();
    }
}

export async function PATCH(request: NextRequest) {
    const { theater, theater_id } = await request.json();
    try {
        const theatre = await prisma.theater.update({
            where: {
                theater_id,
            },
            data: theater,
        });
        return NextResponse.json(theatre);
    } catch (error) {
        console.error("Error updating theatre room:", error);
        return NextResponse.error();
    }
}

export async function DELETE(request: NextRequest) {
    const theaterID = await request.json();
    try {
        const theater = await prisma.theater.delete({
            where: {
                theater_id: theaterID,
            },
        });
        return NextResponse.json(theater);
    } catch (error: unknown) {
        throw NextResponse.error();
    }
}
