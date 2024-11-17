const fetchShowtime = async (showtime_id: number, request_type: string) => {
    if (showtime_id) {
        try {
            const response = await fetch("/api/showtimes", {
                method: "POST",
                body: JSON.stringify({
                    showtime_id,
                    request_type,
                }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching showtimes:", error);
        }
    }
    return;
};

export { fetchShowtime };
