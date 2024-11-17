import { ReservationWithMovieAndShowtimes } from "@/stores/reservationStore";
import { Prisma } from "@prisma/client";

const fetchReservations = async (
    data: number,
    request_type:
        | "reservations_by_user_id"
        | "reservations_by_showtime_id"
        | null
) => {
    const body = {
        data,
        request_type,
    };
    try {
        const response = await fetch("/api/reservations", {
            method: "POST",
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des réservations:",
            error
        );
    }
};

const createReservation = async (
    reservation: Prisma.ReservationUncheckedCreateInput
) => {
    try {
        const response = await fetch("/api/reservations", {
            method: "POST",
            body: JSON.stringify({ data: reservation }),
        });
        const data: ReservationWithMovieAndShowtimes = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de l'ajout d'une réservation:", error);
    }
};

const deleteReservation = async (reservation_id: number) => {
    try {
        const response = await fetch("/api/reservations", {
            method: "DELETE",
            body: JSON.stringify(reservation_id),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des réservations:",
            error
        );
    }
};

export { fetchReservations, deleteReservation, createReservation };
