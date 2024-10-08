import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    function formatArray(value: string | undefined): string[] | undefined {
        return value ? value.split(",") : (value as undefined);
    }

    function formatArrayForSQL(value: string[] | undefined): string | null {
        if (Array.isArray(value)) {
            console.log("array value", `{${value.join(",")}}`);
            return `{${value.join(",")}}`;
        }
        return null;
    }

    const jours = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];

    const searchParams = request.nextUrl.searchParams;

    try {
        const movie_title = searchParams.get("movie_title") as string;
        const movie_description = searchParams.get(
            "movie_description"
        ) as string;
        const genre_id = searchParams.get("genre_id") as string;
        const showtimes = jours.reduce((acc, jour) => {
            acc[`${jour}_showtimes`] = formatArray(
                searchParams.get(`${jour}_showtimes`) as string
            );
            return acc;
        }, {} as Record<string, string[] | undefined>);
        if (!movie_title || !movie_description)
            throw new Error("Title and description required");
        await sql`INSERT INTO Movies (movie_title, movie_description, genre_id, monday_showtimes, tuesday_showtimes, wednesday_showtimes, thursday_showtimes, friday_showtimes, saturday_showtimes, sunday_showtimes) 
         VALUES (${movie_title}, ${movie_description}, ${genre_id}, 
                 ${formatArrayForSQL(showtimes.monday_showtimes)}, 
                 ${formatArrayForSQL(showtimes.tuesday_showtimes)}, 
                 ${formatArrayForSQL(showtimes.wednesday_showtimes)}, 
                 ${formatArrayForSQL(showtimes.thursday_showtimes)}, 
                 ${formatArrayForSQL(showtimes.friday_showtimes)}, 
                 ${formatArrayForSQL(showtimes.saturday_showtimes)}, 
                 ${formatArrayForSQL(showtimes.sunday_showtimes)});`;
    } catch (error) {
        return NextResponse.error();
    }

    const movies = await sql`SELECT * FROM Movies;`;
    return NextResponse.json(movies.rows);
}

export async function GET() {
    try {
        const movies =
            await sql`SELECT * FROM Movies JOIN genres ON movies.genre_id = genres.genre_id;`;
        return NextResponse.json(movies.rows);
    } catch (error) {
        return NextResponse.error();
    }
}
