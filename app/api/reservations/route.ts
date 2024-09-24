import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { userId, showtimeId, seats, totalPrice } = await request.json();
    console.log(userId, showtimeId, seats, totalPrice);
    try {
        const reservation = await sql`
            INSERT INTO reservations (user_id, showtime_id, seats, total_price)
            VALUES (${userId}, ${showtimeId}, ${seats}, ${totalPrice})
            RETURNING *;
        `;

        return NextResponse.json(reservation);
    } catch (error) {
        console.error("Error creating reservation:", error);
        return NextResponse.error();
    }
}
