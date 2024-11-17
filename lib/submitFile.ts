import { Movie } from "@prisma/client";

export async function sendFile(values: object, movie: Movie | undefined) {
    const formData = new FormData();
    Object.values(values).forEach((value: string | Blob, idx: number) => {
        formData.append(Object.keys(values)[idx], value);
    });

    if (!movie) {
        const response = await fetch("/api/movies", {
            method: "POST",
            body: formData,
        });
        return response.json();
    } else {
        const response = await fetch("/api/movies", {
            method: "PATCH",
            body: formData,
        });
        return response.json();
    }
}
