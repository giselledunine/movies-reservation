"use client";

import { useEffect, useState } from "react";

import { Trash } from "lucide-react";

// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useReservationStore } from "@/stores/reservationStore";
import { useUserStore } from "@/stores/userStore";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function MyReservations() {
    const { getReservationsByUserId, reservations, removeReservation } =
        useReservationStore();
    const [tabActiveElement, setTabActiveElement] =
        useState<string>("upcoming");
    const { session } = useUserStore();
    const route = useRouter();

    const handleCancel = async (reservation_id: number) => {
        await removeReservation(reservation_id)
            .then(() => {
                toast({
                    variant: "default",
                    title: "Réservation supprimée",
                });
            })
            .catch(() => {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Une erreur s'est produite",
                });
            });
    };

    useEffect(() => {
        if (session && reservations?.length === 0) {
            getReservationsByUserId(session.user.user_id as number);
        }
    }, [getReservationsByUserId, session, reservations]);

    return (
        <div className="flex flex-col gap-2 justify-center w-full sm:w-2/3 items-center row-start-2 p-4">
            <h1 className="text-xl">Mes réservations</h1>
            <Tabs
                value={tabActiveElement}
                onValueChange={setTabActiveElement}
                className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger className="w-full" value="passed">
                        Passé
                    </TabsTrigger>
                    <TabsTrigger className="w-full capitalize" value="upcoming">
                        à venir
                    </TabsTrigger>
                </TabsList>
                <TabsContent
                    value="passed"
                    className="flex flex-col gap-2 w-full">
                    {reservations ? (
                        reservations.length > 0 ? (
                            reservations
                                .filter(
                                    (res) =>
                                        new Date(res.showtime.show_date) <
                                        new Date()
                                )
                                .map((res) => (
                                    <Card key={res.reservation_id}>
                                        <CardHeader>
                                            <CardTitle>
                                                {res.movie.movie_title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-[2fr_2fr_1fr] gap-2 items-center w-full">
                                                <div>
                                                    {format(
                                                        new Date(
                                                            res.showtime.show_date
                                                        ),
                                                        "dd/MM/yyyy HH:mm"
                                                    )}
                                                </div>
                                                <div>
                                                    {res.seats.join(", ")}
                                                </div>
                                                <div>
                                                    <Button className="hover:cursor-auto">
                                                        {new Intl.NumberFormat(
                                                            "fr-FR",
                                                            {
                                                                style: "currency",
                                                                currency: "EUR",
                                                            }
                                                        ).format(
                                                            res.total_price
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                        ) : (
                            [0, 0, 0].map((_, idx) => (
                                <Skeleton
                                    key={idx}
                                    className="h-[138px] w-full rounded-xl"></Skeleton>
                            ))
                        )
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-4">
                            <p>Aucune réservation</p>
                            <Button variant={"outline"}>
                                Réservez la séance de votre film favoris
                            </Button>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="upcoming" className="flex flex-col gap-2">
                    {reservations ? (
                        reservations.length > 0 ? (
                            reservations
                                .filter(
                                    (res) =>
                                        new Date(res.showtime.show_date) >
                                        new Date()
                                )
                                .map((res) => (
                                    <Card key={res.reservation_id}>
                                        <CardHeader>
                                            <CardTitle>
                                                {res.movie.movie_title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-[2fr_2fr_1fr_auto] gap-2 items-center w-full">
                                                <div>
                                                    {format(
                                                        new Date(
                                                            res.showtime.show_date
                                                        ),
                                                        "dd/MM/yyyy HH:mm"
                                                    )}
                                                </div>
                                                <div>
                                                    {res.seats.join(", ")}
                                                </div>
                                                <div>
                                                    <Button className="hover:cursor-auto">
                                                        {new Intl.NumberFormat(
                                                            "fr-FR",
                                                            {
                                                                style: "currency",
                                                                currency: "EUR",
                                                            }
                                                        ).format(
                                                            res.total_price
                                                        )}
                                                    </Button>
                                                </div>
                                                <div className="w-fit">
                                                    <Button
                                                        variant="destructive"
                                                        className="w-9 sm:w-fit"
                                                        onClick={() =>
                                                            handleCancel(
                                                                res.reservation_id
                                                            )
                                                        }>
                                                        <Trash />
                                                        <p className="hidden sm:block">
                                                            Annuler
                                                        </p>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                        ) : (
                            [0, 0, 0].map((_, idx) => (
                                <Skeleton
                                    key={idx}
                                    className="h-[138px] w-full rounded-xl"></Skeleton>
                            ))
                        )
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-4">
                            <p>Aucune réservation</p>
                            <Button
                                variant={"outline"}
                                onClick={() => route.push("/")}>
                                Réservez la séance de votre film favoris
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
            {/* <Table>
                <TableCaption>A list of your reservations.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="col-span-1">Movie</TableHead>
                        <TableHead className="col-span-1">Date</TableHead>
                        <TableHead className="col-span-2">Seats</TableHead>
                        <TableHead className="col-span-1">Amount</TableHead>
                        <TableHead className="text-right col-span-1">
                            Cancel
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reservations.map((res) => (
                        <TableRow key={res.reservation_id}>
                            <TableCell className="font-medium">
                                {res.movie.movie_title}
                            </TableCell>
                            <TableCell>
                                {format(
                                    new Date(res.showtime.show_date),
                                    "dd/MM/yyyy HH:mm"
                                )}
                            </TableCell>
                            <TableCell>{res.seats.join(", ")}</TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                }).format(res.total_price)}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="destructive"
                                    className="w-9 sm:w-fit"
                                    onClick={() =>
                                        handleCancel(res.reservation_id)
                                    }>
                                    <Trash />
                                    <p className="hidden sm:block">Annuler</p>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table> */}
        </div>
    );
}
