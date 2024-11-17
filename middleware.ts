import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions, UserWithRoleSession } from "./lib/authOptions";
// import { NextApiRequest, NextApiResponse } from "next";

// export async function middleware(req: NextApiRequest, res: NextApiResponse) {
//     const session = await getServerSession(req, res, authOptions);
//     const { pathname } = req.nextUrl;

//     // if (!session) {
//     //     return NextResponse.redirect(new URL("/login", req.url));
//     // }

//     console.log("decodedToken", session);
//     // if (pathname.startsWith("/management")) {
//     //     // Verify the role
//     //     if (decodedToken.user.role !== "admin") {
//     //         // If not an admin, redirect to an error page or home
//     //         return NextResponse.redirect(new URL("/", request.url));
//     //     }
//     // }

//     return NextResponse.next();
// }

export default withAuth(
    // Matches the pages config in `[...nextauth]`
    function middleware(req) {
        console.log("token", req.nextauth.token);
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                const { method } = req;
                const sensibleMethods = ["POST", "PATCH", "DELETE"].includes(
                    method
                );
                const origin =
                    req.headers.get("origin") ||
                    req.headers.get("referer") ||
                    process.env.NODE_ENV == "production"
                        ? `https://${req.headers.get("host")}`
                        : `http://${req.headers.get("host")}`;
                const allowedOrigins = [
                    "http://localhost:3000",
                    "https://movies.sophiahmamouche.com/",
                ];

                if (
                    (allowedOrigins.find((allowed) =>
                        origin.startsWith(allowed)
                    ) &&
                        pathname.startsWith("/management")) ||
                    (pathname.startsWith("/api") &&
                        !pathname.startsWith("/api/reservations") &&
                        sensibleMethods)
                ) {
                    console.log("token role", token?.role);
                    return token?.role === "admin";
                } else if (
                    (allowedOrigins.includes(origin) &&
                        pathname.startsWith("/reservations")) ||
                    pathname.startsWith("/account")
                ) {
                    return token ? true : false;
                }
                return true;
            },
        },
        pages: {
            signIn: "/",
            error: "/error",
        },
    }
);

// Configurer les routes où le middleware doit s'appliquer
export const config = {
    matcher: ["/management/:path*", "/api/:path*", "/reservations", "/account"], // Appliquer le middleware sur toutes les routes commençant par /dashboard
};
