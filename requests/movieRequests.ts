import { AddMovieType, UpdateMovieType } from "@/stores/movieStore";

const fetchMovies = async () => {
    try {
        const response = await fetch("/api/movies");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
};

const fetchGenres = async () => {
    try {
        const response = await fetch("/api/genres");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
};

const fetchMovie = async (movie_id: number, request_type = "movie_by_id") => {
    try {
        const response = await fetch("/api/movies", {
            method: "POST",
            body: JSON.stringify({ movie_id, request_type }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
};

const addMovie = async (values: AddMovieType) => {
    const formData = new FormData();
    Object.values(values).forEach((value, idx: number) => {
        formData.append(Object.keys(values)[idx], value as string | Blob);
    });
    try {
        const response = await fetch("/api/movies", {
            method: "POST",
            body: formData,
        });
        return response.json();
    } catch (err) {
        console.error("Error adding movie:", err);
    }
};

const updateMovie = async (values: UpdateMovieType) => {
    const formData = new FormData();
    Object.values(values).forEach((value, idx: number) => {
        formData.append(Object.keys(values)[idx], value as string | Blob);
    });
    try {
        const response = await fetch("/api/movies", {
            method: "PATCH",
            body: formData,
        });
        return response.json();
    } catch (err) {
        console.error("Error updating movie:", err);
    }
};

const removeMovie = async (movie_id: number) => {
    try {
        const response = await fetch("/api/movies", {
            method: "DELETE",
            body: JSON.stringify({ movie_id }),
        });
        return response.json();
    } catch (err) {
        console.error("Error updating movie:", err);
    }
};

export {
    fetchMovies,
    fetchMovie,
    addMovie,
    updateMovie,
    removeMovie,
    fetchGenres,
};
