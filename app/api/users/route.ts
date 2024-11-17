import bcrypt from "bcrypt";
import { NextResponse, NextRequest } from "next/server";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import AppError from "@/lib/AppError";

const saltRounds = 10;

async function hashPassword(plainPassword: string) {
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error("Erreur lors du hachage du mot de passe", err);
    }
}

async function verifyPassword(
    plainPassword: string,
    storedHashedPassword: string
) {
    const isMatch = await bcrypt.compare(plainPassword, storedHashedPassword);
    return isMatch;
}

export async function POST(request: NextRequest) {
    const {
        firstname,
        lastname,
        email,
        phone_number,
        clearPassword,
        request_type,
    } = await request.json();

    if (request_type == "login") {
        const cookieStore = await cookies();
        const user = await sql`SELECT * FROM users WHERE email = ${email}`
            .then(async (res) => {
                const { password } = res.rows[0];
                return await verifyPassword(clearPassword, password).then(
                    (match) => {
                        if (match) {
                            cookieStore.set(
                                "user",
                                JSON.stringify(res.rows[0])
                            );
                            return res.rows[0];
                        } else {
                            return new AppError(
                                "Le mot de passe est incorrect",
                                400
                            );
                        }
                    }
                );
            })
            .catch(() => {
                return new AppError("Adresse mail incorrect", 400);
            });

        return NextResponse.json(user);

        // if (await verifyPassword(clearPassword, password)) {
        //     return NextResponse.json(user);
        // } else {
        //     throw NextResponse.json(
        //         new AppError("Le mot de passe est incorrect", 400)
        //     );
        // }
    } else {
        const hashedPassword = await hashPassword(clearPassword);

        try {
            const user =
                await sql`INSERT INTO users (firstname, lastname, email, password, phone_number) VALUES (${firstname}, ${lastname}, ${email}, ${hashedPassword}, ${phone_number}) RETURNING *;`;
            return NextResponse.json(user);
        } catch (error: unknown) {
            throw NextResponse.error();
        }
    }
}
