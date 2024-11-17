import { Datas } from "@/stores/theatreStore";
import { Theater } from "@prisma/client";

const fetchTheaters = async () => {
    try {
        const response = await fetch("/api/theatre_room");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des théâtres:", error);
    }
};

const removeTheater = async (theaterID: number) => {
    try {
        const response = await fetch("/api/theatre_room", {
            method: "DELETE",
            body: JSON.stringify(theaterID),
        });
        return response.json();
    } catch (error) {
        console.error("Erreur lors de la suppression du théâtre:", error);
    }
};

const updateTheater = async (datas: Datas) => {
    try {
        const response = await fetch("/api/theatre_room", {
            method: "PATCH",
            body: JSON.stringify(datas),
        });
        return response.json();
    } catch (error) {
        console.error("Erreur lors de la modification du théâtre:", error);
    }
};

const addTheater = async (datas: Datas) => {
    try {
        const response = await fetch("/api/theatre_room", {
            method: "POST",
            body: JSON.stringify(datas),
        });
        return response.json();
    } catch (error) {
        console.error("Erreur lors de l'ajout du théâtre:", error);
    }
};

export { fetchTheaters, removeTheater, addTheater, updateTheater };
