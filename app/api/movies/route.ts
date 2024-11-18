import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function GET() {
    try {
        const movies = await prisma.movie.findMany({
            include: {
                genres: true,
                showtimes: { include: { theater: true } },
            },
        });
        return NextResponse.json(movies);
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(request: NextRequest) {
    //to get a formData sent in a body, use request.formData() not request.json()
    const form = await request.formData();
    const movie_id = form.get("movie_id");

    if (movie_id) {
        const movie = await prisma.movie
            .findUnique({
                where: {
                    movie_id: Number(movie_id),
                },
                include: {
                    genres: true,
                    showtimes: {
                        include: { theater: true },
                    },
                },
            })
            .then((res) => res)
            .catch((err) => err);

        return NextResponse.json(movie);
    } else {
        const image = form.get("movie_poster");
        const genresForm = form.get("genres") as string;
        const genres = genresForm?.split(",");
        const movie: Prisma.MovieUncheckedCreateInput = {
            movie_title: form.get("movie_title") as string,
            movie_description: form.get("movie_description") as string,
            movie_duration: Number(form.get("movie_duration")),
            movie_poster: "",
            movie_poster_fullpath: form.get("movie_poster_fullpath") as string,
            genres: {
                connect: genres?.map((genre) => ({
                    genre_id: Number(genre),
                })),
            },
        };

        if (image instanceof File) {
            const moviesRef = ref(storage, movie.movie_poster_fullpath);
            //throw NextResponse.json({ res }, { status: 400 });
            return await uploadBytes(moviesRef, image)
                .then(
                    async () =>
                        await getDownloadURL(moviesRef)
                            .then(async (res: string) => {
                                movie.movie_poster = res;
                                return await prisma.movie
                                    .create({
                                        data: movie,
                                        include: {
                                            genres: true,
                                            showtimes: true,
                                        },
                                    })
                                    .then((res) => NextResponse.json(res))
                                    .catch((err) =>
                                        NextResponse.json({
                                            error: {
                                                message: "Prisma error",
                                                err,
                                            },
                                            status: 400,
                                        })
                                    );
                            })
                            .catch((err) =>
                                NextResponse.json({
                                    error: {
                                        message: "Couldn't get the dowload url",
                                        err,
                                    },
                                    status: 400,
                                })
                            )
                )
                .catch((err) => {
                    console.error(err);
                    return NextResponse.json({
                        error: { message: "Could upload the image", err },
                        status: 400,
                    });
                });
        } else {
            return NextResponse.json({
                error: { message: ": No files received." },
                status: 400,
            });
        }
    }
}

export async function PATCH(request: NextRequest) {
    const form = await request.formData();
    const image = form.get("movie_poster");
    const previous_image_fullpath = form.get("previous_image_fullpath");
    const movie_id = Number(form.get("movie_id"));
    const genresForm = form.get("genres") as string;
    const genres = genresForm?.split(",");
    const movie: Prisma.MovieUncheckedUpdateInput = {
        movie_title: form.get("movie_title") as string,
        movie_description: form.get("movie_description") as string,
        movie_duration: Number(form.get("movie_duration")),
        genres: {
            set: genres?.map((genre) => ({
                genre_id: Number(genre),
            })),
        },
    };
    if (image instanceof File) {
        const filename = image.name.replaceAll(" ", "_");
        const fullpath = `movies/${filename}`;
        const moviesRef = ref(storage, fullpath);
        // add image to firebase storage
        await uploadBytes(moviesRef, image).catch((err) => {
            console.error(err);
        });
        const url = await getDownloadURL(moviesRef);
        movie.movie_poster = url;
        movie.movie_poster_fullpath = fullpath;
        // update new movie with the url of the image and the fullpath for later use
        const updateMovie = await prisma.movie
            .update({
                where: {
                    movie_id,
                },
                data: movie,
                include: {
                    genres: true,
                },
            })
            .then((res) => res)
            .catch((err) => {
                return err;
                // return NextResponse.json(
                //     { error: "The datas couldn't be added" },
                //     { status: 400 }
                // );
            });
        // get previous image ref
        const previousImageRef = ref(
            storage,
            previous_image_fullpath as string
        );
        // delete previous image
        await deleteObject(previousImageRef).catch(() =>
            NextResponse.json(
                { error: "The previous image couldn't be deleted" },
                { status: 400 }
            )
        );
        return NextResponse.json(updateMovie);
    } else {
        const updateMovie = await prisma.movie
            .update({
                where: {
                    movie_id,
                },
                data: movie,
                include: {
                    genres: true,
                },
            })
            .then((res) => res)
            .catch(() => {
                return NextResponse.json(
                    { error: "Movie couldn't be updated", status: 400 },
                    { status: 400 }
                );
            });
        return NextResponse.json(updateMovie);
    }
}

export async function DELETE(request: NextRequest) {
    const { movie_id } = await request.json();
    return await prisma.movie
        .delete({
            where: { movie_id },
        })
        .then(async (res) => {
            const previousImageRef = ref(
                storage,
                res.movie_poster_fullpath as string
            );
            // delete previous image
            return await deleteObject(previousImageRef)
                .then(() => NextResponse.json(res))
                .catch(() =>
                    NextResponse.json(
                        { error: "The previous image couldn't be deleted" },
                        { status: 400 }
                    )
                );
        })
        .catch((err) => {
            console.error(err);
            return NextResponse.error();
        });
}
