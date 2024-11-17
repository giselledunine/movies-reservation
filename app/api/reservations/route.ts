import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
    const {
        data,
        request_type,
    }: {
        data: Prisma.ReservationCreateManyInput | number;
        request_type?:
            | "reservations_by_showtime_id"
            | "reservations_by_user_id";
    } = await request.json();
    if (request_type === "reservations_by_user_id") {
        try {
            const reservations = await prisma.reservation.findMany({
                where: { user_id: data as number },
                include: {
                    movie: true,
                    showtime: true,
                },
            });
            return NextResponse.json(reservations.length > 0 && reservations);
        } catch (error) {
            console.error("Error finding reservations:", error);
            return NextResponse.error();
        }
    } else if (request_type === "reservations_by_showtime_id") {
        try {
            const reservation = await prisma.reservation.findMany({
                where: { showtime_id: data as number },
                include: { user: true },
            });
            return NextResponse.json(reservation);
        } catch (error) {
            console.error("Error creating reservation:", error);
            return NextResponse.error();
        }
    } else {
        const dataAsReservation = data as Prisma.ReservationCreateManyInput;
        try {
            const reservation = await prisma.reservation.create({
                data: dataAsReservation,
                include: {
                    movie: true,
                    showtime: true,
                },
            });
            await prisma.showtime.update({
                where: { showtime_id: dataAsReservation.showtime_id },
                data: {
                    available_seats: {
                        decrement: dataAsReservation.seats
                            ? Array.isArray(dataAsReservation.seats)
                                ? dataAsReservation.seats.length
                                : 0
                            : 0,
                    },
                },
            });

            return NextResponse.json(reservation);
        } catch (error) {
            console.error("Error creating reservation:", error);
            return NextResponse.error();
        }
    }
}

export async function DELETE(request: NextRequest) {
    const reservation_id: number = await request.json();

    return await prisma.reservation
        .delete({
            where: { reservation_id },
        })
        .then(async (res) => {
            await prisma.showtime.update({
                where: { showtime_id: res.showtime_id },
                data: {
                    available_seats: {
                        increment: res.seats
                            ? Array.isArray(res.seats)
                                ? res.seats.length
                                : 0
                            : 0,
                    },
                },
            });
            return NextResponse.json(res);
        })
        .catch((err) => {
            return NextResponse.json({ message: err, status: "error" });
        });
}
