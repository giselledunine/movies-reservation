"use client";

import { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/DatePicker";
import { TimePicker } from "@/components/TimePicker";
import { Loader2, PlusIcon } from "lucide-react";
import {
    UpdateIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableCaption,
    TableRow,
    TableHeader,
    TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
    addYears,
    format,
    subDays,
    addDays,
    startOfISOWeek,
    setISOWeek,
    setYear,
    getISOWeek,
} from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Prisma } from "@prisma/client";
import { useMovieStore } from "@/stores/movieStore";
import { useTheatreStore } from "@/stores/theatreStore";
import Cookies from "js-cookie";
import { fetchReservations } from "@/requests/reservationRequests";
import { DialogTrigger } from "@radix-ui/react-dialog";

type ShowtimeWithTheater = Prisma.ShowtimeGetPayload<{
    include: { theater: true };
}>;

type weekDayType = {
    name: string;
    date: Date;
};

export default function ShowtimesManagement() {
    const { movies, selectedMovie, setSelectedMovie, getMovies, getMovie } =
        useMovieStore();
    const movie_id = Cookies.get("movie_id");
    const { theaters, getTheaters } = useTheatreStore();
    const [showtimesWeekly, setShwotimesWeekly] = useState<{
        [week: number]: ShowtimeWithTheater[];
    }>({});
    const [showtimesDaily, setShwotimesDaily] = useState<{
        [day: string]: ShowtimeWithTheater[];
    }>({});
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [loadAddMovie, setLoadAddMovie] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAddMovie, setOpenAddMovie] = useState(false);
    const [week, setWeek] = useState<number>(getISOWeek(new Date()));
    console.log("week", week);
    const [day, setDay] = useState<Date>(new Date());
    const [weekDisplay, setWeekDisplay] = useState<string>("Cette semaine");
    const moviesIDsList: string[] = movies.map((movie) =>
        movie.movie_id.toString()
    );
    const theaterIDsList = theaters.map((theater) =>
        theater.theater_id.toString()
    );

    const [weekDays, setWeekDays] = useState<weekDayType[]>([]);
    const hours = [
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30",
        "00:00",
        "00:30",
    ];

    //Add Showtime Form
    function ShowtimesForm() {
        const formSchema = z.object({
            movie_id: z
                .string()
                .refine(
                    (val) => moviesIDsList.includes(val),
                    "Veuillez choisir un film"
                ),
            show_date: z
                .date({
                    required_error: "Please select a date",
                    invalid_type_error: "That's not a date!",
                })
                .array(),
            show_time: z.date({
                required_error: "Please select a time",
                invalid_type_error: "That's not a time!",
            }),
            theater_id: z
                .string()
                .refine(
                    (val) => theaterIDsList.includes(val),
                    "Cette salle n'existe pas"
                ),
        });
        // 1. Define your form.
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                movie_id,
                show_date: [day],
                show_time: new Date(),
                theater_id: theaters[0]?.theater_id.toString() || "",
            },
        });

        // 2. Define a submit handler.
        async function onSubmit(values: z.infer<typeof formSchema>) {
            const theater = theaters.find(
                (el) => el.theater_id.toString() === values.theater_id
            );
            const getTimestamp = () => {
                if (
                    new Date() < new Date("27/10") &&
                    new Date() > new Date("31/03")
                ) {
                    return "+02:00";
                } else {
                    return "+01:00";
                }
            };
            const datas = {
                movie_id: values.movie_id,
                theater_id: values.theater_id,
                dates: values.show_date.map(
                    (date) =>
                        `${format(date, "yyyy-MM-dd")}T${format(
                            values.show_time,
                            "H:mm"
                        )}${getTimestamp()}`
                ),
                available_seats:
                    theater?.columns && theater?.rows
                        ? theater.columns * theater.rows
                        : 0,
            };
            try {
                await fetch("/api/showtimes", {
                    method: "POST",
                    body: JSON.stringify(datas),
                });
                setLoadAddMovie(true);
                await getMovies();
                setLoadAddMovie(false);
                setOpenAddMovie(false);
                toast({
                    variant: "default",
                    title: "Séance ajoutée",
                    description: `La séance on bien été ajoutée`,
                });
            } catch (err) {
                console.error("Error adding showtime", err);
            }
            // Do something with the form values.
            // ✅ This will be type-safe and validated.
        }

        return (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8">
                    <FormField
                        control={form.control}
                        name="movie_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Film</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisissez un film" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {moviesIDsList.map((movie, idx) => (
                                            <SelectItem
                                                key={idx}
                                                value={movie.toString()}>
                                                {
                                                    movies.find(
                                                        (el) =>
                                                            el.movie_id ==
                                                            Number(movie)
                                                    )?.movie_title
                                                }
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2">
                        <FormField
                            control={form.control}
                            name="show_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date de la séance</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "md:w-full pl-3 text-left font-normal",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}>
                                                    {field.value ? (
                                                        field.value
                                                            .map((value) =>
                                                                format(
                                                                    value,
                                                                    "PPP"
                                                                )
                                                            )
                                                            .slice(0, 2) + "..."
                                                    ) : (
                                                        <span>
                                                            Choisissez une date
                                                        </span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0 pointer-events-auto"
                                            align="start">
                                            <Calendar
                                                mode="multiple"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date <
                                                        subDays(
                                                            new Date(),
                                                            1
                                                        ) ||
                                                    date >
                                                        addYears(new Date(), 1)
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="show_time"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Heure de la séance</FormLabel>
                                    <TimePicker
                                        type="half_minutes"
                                        date={field.value}
                                        setDate={field.onChange}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="theater_id"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Salle de cinéma</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisissez une salle de cinéma" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {theaters
                                            .sort(
                                                (a, b) =>
                                                    a.room_number -
                                                    b.room_number
                                            )
                                            .map((theater, idx) => (
                                                <SelectItem
                                                    key={idx}
                                                    value={theater.theater_id.toString()}>
                                                    {theater.room_number}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">
                        {loadAddMovie && (
                            <ReloadIcon className="animate-spin" />
                        )}
                        Submit
                    </Button>
                </form>
            </Form>
        );
    }

    const getShowtimesByWeeks = useCallback(() => {
        const showitmesSorted: {
            [key: number]: ShowtimeWithTheater[];
        } = {};
        selectedMovie?.showtimes.forEach((showtime) => {
            const week = Number(format(showtime.show_date, "w"));
            if (showitmesSorted[week]) {
                showitmesSorted[week].push(showtime);
            } else {
                showitmesSorted[week] = [showtime];
            }
        });
        return showitmesSorted;
    }, [selectedMovie]);

    const getShowtimesByDays = useCallback(() => {
        const showitmesSorted: {
            [key: string]: ShowtimeWithTheater[];
        } = {};
        selectedMovie?.showtimes.forEach((showtime) => {
            const formatedDay = format(showtime.show_date, "dd/MM/yyyy");
            if (showitmesSorted[formatedDay]) {
                showitmesSorted[formatedDay].push(showtime);
            } else {
                showitmesSorted[formatedDay] = [showtime];
            }
        });
        return showitmesSorted;
    }, [selectedMovie]);

    //Deleting showtimes when theere is no reservations
    const handleDelete = async (showtime_id: number) => {
        await fetch("/api/showtimes", {
            method: "DELETE",
            body: JSON.stringify(showtime_id),
        });
    };

    //Showtime component
    const DisplayShowtime = ({
        type,
        showtime,
    }: {
        type: "weekly" | "daily";
        showtime: ShowtimeWithTheater;
    }) => {
        const [openDelete, setIsOpenDelete] = useState<boolean>(false);
        const [loading, setLoading] = useState<boolean>(false);
        const [reservations, setReservations] = useState<
            Prisma.ReservationGetPayload<{ include: { user: true } }>[]
        >([]);
        const euro = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        });
        const handleDeleteModal = () => {
            setIsOpenDelete(true);
        };

        //Funciton to display the Showitmes in the calendar
        const getGrids = (showtime: ShowtimeWithTheater) => {
            if (type === "weekly") {
                const startHour =
                    (new Date(showtime.show_date).getHours() * 60) / 30 -
                    (10 * 60) / 30 +
                    2;
                const startMinute =
                    Number(format(new Date(showtime.show_date), "mm")) / 30;
                const gridRowStart = startHour + startMinute;
                const gridRowEnd =
                    gridRowStart +
                    (selectedMovie?.movie_duration
                        ? selectedMovie.movie_duration / 30 - 1
                        : 0);
                const weekDay = Number(format(showtime.show_date, "i"));

                return {
                    gridColumnStart: weekDay + 1,
                    gridRowStart,
                    gridRowEnd,
                };
            } else {
                const startHour =
                    (new Date(showtime.show_date).getHours() * 60) / 30 -
                    (10 * 60) / 30 +
                    1;
                const startMinute =
                    Number(format(new Date(showtime.show_date), "mm")) / 30;
                const gridRowStart = startHour + startMinute;
                const gridRowEnd =
                    gridRowStart +
                    (selectedMovie?.movie_duration
                        ? selectedMovie.movie_duration / 30 - 1
                        : 0);
                return {
                    gridColumnStart: 2,
                    gridRowStart,
                    gridRowEnd,
                };
            }
        };

        useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                await fetchReservations(
                    showtime.showtime_id,
                    "reservations_by_showtime_id"
                ).then((res) => {
                    setReservations(res);
                    setLoading(false);
                });
            };
            if (openDelete) {
                fetchData();
            }
        }, [openDelete, showtime]);

        return (
            <>
                <Dialog open={openDelete} onOpenChange={setIsOpenDelete}>
                    <DialogContent>
                        {loading ? (
                            <div className="w-full h-[100px] flex justify-center items-center">
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : reservations.length > 0 ? (
                            <>
                                <DialogHeader>
                                    <DialogTitle>Les réservations</DialogTitle>
                                    <DialogDescription>
                                        {format(
                                            showtime.show_date,
                                            "iiii d MMMM HH:mm"
                                        )}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-between">
                                    <div className="bg-primary text-secondary font-medium px-2 py-1 rounded-md">
                                        {showtime.theater.columns *
                                            showtime.theater.rows -
                                            showtime.available_seats}
                                        /
                                        {showtime.theater.columns *
                                            showtime.theater.rows}
                                    </div>
                                    <div className="bg-primary text-secondary font-medium px-2 py-1 rounded-md">
                                        {euro.format(
                                            reservations.reduce(
                                                (acc, res) =>
                                                    acc + res.total_price,
                                                0
                                            )
                                        )}
                                    </div>
                                </div>
                                <Table>
                                    <TableCaption>
                                        A list of your reservations
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Seats</TableHead>
                                            <TableHead className="text-right">
                                                Amount
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reservations.map((res) => (
                                            <TableRow key={res.reservation_id}>
                                                <TableCell>
                                                    {res.user.name}
                                                </TableCell>
                                                <TableCell>
                                                    {res.seats.join(",")}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {euro.format(
                                                        res.total_price
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </>
                        ) : (
                            <>
                                <DialogHeader>
                                    <DialogTitle>{`Supprimer la séance du ${format(
                                        showtime.show_date,
                                        "iiii d MMMM HH:mm"
                                    )}`}</DialogTitle>
                                    <DialogDescription>
                                        Voulez vous supprimer cette séance ?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        variant={"destructive"}
                                        onClick={() =>
                                            handleDelete(showtime.showtime_id)
                                        }>
                                        Supprimer
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                onClick={() => handleDeleteModal()}
                                key={showtime.showtime_id}
                                className="bg-primary rounded-md w-[calc(100%-0.25rem*2)] hover:bg-secondary transition ease-in-out cursor-pointer m-1"
                                style={getGrids(showtime)}></div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {showtime.theater.columns *
                                    showtime.theater.rows -
                                    showtime.available_seats}
                                /
                                {showtime.theater.columns *
                                    showtime.theater.rows}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </>
        );
    };

    // Refresh the showtime datas for available seats etc ...
    const handleRefresh = async () => {
        setRefreshLoading(true);
        await getMovie(Number(movie_id)).then(() => setRefreshLoading(false));
    };

    // Display the week infos
    const getWeek = useCallback(() => {
        const year = new Date().getFullYear(); // Current year
        const firstDateOfWeek = startOfISOWeek(
            setISOWeek(setYear(new Date(), year), week)
        );
        const lastDateOfWeek = addDays(firstDateOfWeek, 6);
        if (getISOWeek(new Date()) === week) {
            setWeekDisplay("Cette semaine");
        } else {
            setWeekDisplay(
                `${format(firstDateOfWeek, "dd/MM/yyyy")} - ${format(
                    lastDateOfWeek,
                    "dd/MM/yyyy"
                )}`
            );
        }
        const weekDays = [];
        for (let i = firstDateOfWeek; i <= lastDateOfWeek; i = addDays(i, 1)) {
            weekDays.push({
                name: format(i, "EEEEE"),
                date: i,
            });
        }
        setWeekDays(weekDays);
    }, [week]);

    useEffect(() => {
        if (movies.length === 0) {
            getMovies();
        }
        if (theaters.length === 0) {
            getTheaters();
        }
    }, [movies, theaters, getMovies, getTheaters]);

    useEffect(() => {
        if (movie_id) {
            setSelectedMovie(Number(movie_id));
        }
    }, [movies, movie_id, setSelectedMovie]);

    useEffect(() => {
        getWeek();
    }, [week, getWeek]);

    useEffect(() => {
        setShwotimesWeekly(() => getShowtimesByWeeks());
        setShwotimesDaily(() => getShowtimesByDays());
    }, [
        selectedMovie,
        setShwotimesWeekly,
        setShwotimesDaily,
        getShowtimesByDays,
        getShowtimesByWeeks,
    ]);

    useEffect(() => {
        setWeek(getISOWeek(day));
    }, [day]);

    const WeeklyShowtimes = () => {
        return (
            <div className="grid-cols-1 grid-rows-1 hidden sm:grid">
                <div className="row-start-1 col-start-1 grid grid-cols-8 justify-items-center grid-rows-[1fr_repeat(30,24px)]">
                    {Array.from({ length: 32 }, (_, idx) => idx).map(
                        (_, indexRow) =>
                            Array.from({ length: 8 }, (_, index) => index).map(
                                (_, indexColumn) => (
                                    <div
                                        className={`${
                                            indexRow % 2
                                                ? "border-b-none"
                                                : indexColumn !== 0 &&
                                                  indexRow !== 0 &&
                                                  "border-b"
                                        } h-full w-full ${
                                            indexRow !== 0 &&
                                            indexColumn !== 0 &&
                                            "border-r"
                                        } ${
                                            indexRow == 1 &&
                                            indexColumn !== 0 &&
                                            "border-t"
                                        }`}
                                        key={indexColumn}></div>
                                )
                            )
                    )}
                </div>
                <div className="row-start-1 col-start-1 grid grid-cols-8 justify-items-center grid-rows-[1fr_repeat(30,24px)]">
                    {weekDays.map((weekday, idx) => (
                        <div
                            key={idx}
                            className="my-1 capitalize mb-4 flex justify-between align-center w-full px-2"
                            style={{
                                gridRow: "1",
                                gridColumn: idx + 2,
                            }}>
                            {weekday?.name}
                            <Badge
                                variant={
                                    format(
                                        new Date(weekday?.date),
                                        "dd/MM/yyyy"
                                    ) === format(day, "dd/MM/yyyy")
                                        ? "default"
                                        : new Date().getDate() ===
                                          weekday?.date.getDate()
                                        ? "secondary"
                                        : "outline"
                                }>
                                {weekday?.date.getDate()}
                            </Badge>
                        </div>
                    ))}
                    {hours.map((hour, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                " my-1 text-xs m-0 transform -translate-y-1/2 h-fit",
                                idx % 2 === 0
                                    ? "text-primary"
                                    : "text-secondary"
                            )}
                            style={{
                                gridColumn: "1",
                                gridRowStart: idx + 2,
                                gridRowEnd: idx + 3,
                            }}>
                            {hour}
                        </div>
                    ))}
                    {showtimesWeekly[week]?.map((showtime) => (
                        <DisplayShowtime
                            type={"weekly"}
                            key={showtime.showtime_id}
                            showtime={showtime}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const DailyShowtimes = () => {
        return (
            <div className="grid sm:hidden grid-cols-1 grid-rows-[auto_1fr] gap-4">
                <div className="row-start-1 col-start-1 flex my-4">
                    <div className="grid grid-cols-7 w-full">
                        {weekDays.map((weekday, idx) => (
                            <div
                                key={idx}
                                className=" my-1 capitalize flex flex-col justify-center text-center items-center w-full px-2">
                                {weekday?.name}
                                <Badge
                                    variant={
                                        format(
                                            new Date(weekday?.date),
                                            "dd/MM/yyyy"
                                        ) === format(day, "dd/MM/yyyy")
                                            ? "default"
                                            : new Date().getDate() ===
                                              weekday?.date.getDate()
                                            ? "secondary"
                                            : "outline"
                                    }>
                                    {weekday?.date.getDate()}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="row-start-2 col-start-1 grid grid-cols-[1fr_7fr] justify-items-center grid-rows-[repeat(29,24px)]">
                    {Array.from({ length: 29 }, (_, idx) => idx).map(
                        (_, indexRow) =>
                            Array.from({ length: 1 }, (_, index) => index).map(
                                (_, indexColumn) => (
                                    <div
                                        className={`${
                                            indexRow % 2 ? "border-b" : ""
                                        } h-full w-full col-start-2 ${
                                            indexRow == 0 && "border-t"
                                        }`}
                                        key={indexColumn}></div>
                                )
                            )
                    )}
                </div>
                <div className="row-start-2 col-start-1 grid grid-cols-[1fr_7fr] justify-items-center grid-rows-[repeat(29,24px)]">
                    {hours.map((hour, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "text-xs transform -translate-y-1/2 h-fit",
                                idx % 2 === 0
                                    ? "text-primary"
                                    : "text-secondary"
                            )}
                            style={{
                                gridColumn: "1",
                                gridRowStart: idx + 1,
                            }}>
                            {hour}
                        </div>
                    ))}
                    {showtimesDaily[format(day, "dd/MM/yyyy")]?.map(
                        (showtime) => (
                            <DisplayShowtime
                                type={"daily"}
                                key={showtime.showtime_id}
                                showtime={showtime}
                            />
                        )
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-2">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between">
                                {selectedMovie
                                    ? movies.find(
                                          (movie) =>
                                              movie.movie_id ===
                                              selectedMovie.movie_id
                                      )?.movie_title
                                    : "Select movie..."}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Search movie..."
                                    className="h-9"
                                />
                                <CommandList>
                                    <CommandEmpty>No movie found.</CommandEmpty>
                                    <CommandGroup>
                                        {movies?.map((movie) => (
                                            <CommandItem
                                                key={movie.movie_id}
                                                value={movie.movie_title}
                                                onSelect={(currentValue) => {
                                                    setSelectedMovie(
                                                        movies.find(
                                                            (movie) =>
                                                                movie.movie_title ===
                                                                currentValue
                                                        )?.movie_id ===
                                                            selectedMovie?.movie_id
                                                            ? 0
                                                            : Number(
                                                                  movies.find(
                                                                      (movie) =>
                                                                          movie.movie_title ===
                                                                          currentValue
                                                                  )?.movie_id
                                                              )
                                                    );
                                                    setOpen(false);
                                                }}>
                                                {movie.movie_title}
                                                <CheckIcon
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        movie.movie_id ===
                                                            selectedMovie?.movie_id
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Dialog open={openAddMovie} onOpenChange={setOpenAddMovie}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusIcon />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <ShowtimesForm />
                        </DialogContent>
                    </Dialog>
                    <Button onClick={() => handleRefresh()}>
                        <UpdateIcon
                            className={refreshLoading ? "animate-spin" : ""}
                        />
                    </Button>
                </div>
                <div className="hidden sm:flex justify-between items-center">
                    <div>
                        <Button
                            onClick={() => setWeek((prev) => prev - 1)}
                            variant={"outline"}
                            size="icon">
                            <ChevronLeftIcon />
                        </Button>
                    </div>
                    <div>{weekDisplay}</div>
                    <div>
                        <Button
                            onClick={() => setWeek((prev) => prev + 1)}
                            variant={"outline"}
                            size="icon">
                            <ChevronRightIcon />
                        </Button>
                    </div>
                </div>
                <div className="flex sm:hidden justify-between items-center gap-2">
                    <div>
                        <Button
                            onClick={() => setDay((prev) => subDays(prev, 1))}
                            variant={"outline"}
                            size="icon">
                            <ChevronLeftIcon />
                        </Button>
                    </div>
                    <DatePicker date={day} setDate={setDay} />
                    <div>
                        <Button
                            onClick={() => setDay((prev) => addDays(prev, 1))}
                            variant={"outline"}
                            size="icon">
                            <ChevronRightIcon />
                        </Button>
                    </div>
                </div>
                <WeeklyShowtimes />
                <DailyShowtimes />
            </div>
        </div>
    );
}
