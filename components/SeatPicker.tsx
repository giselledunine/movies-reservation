"use client";

import { useState, useEffect } from "react";
import { PlusIcon, MinusIcon, ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Seat } from "./Seat";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import Image from "next/image";

type Seat = {
    id: string;
    row: number;
    number: number;
    status: "available" | "selected" | "taken";
};

type Reservation = {
    userId: number;
    showtimeId: number;
    seats: string[];
    totalPrice: number;
};

type Card = {
    cardNumber: string;
    expirationDate: string;
    securityCode: string;
    name: string;
};

type Tickets = {
    type: string;
    number: number;
    price: number;
};

export function SeatPicker({
    children,
    disabled,
    showtime,
    rows = 8,
    seatsPerRow = 10,
}: {
    children: React.ReactNode;
    disabled?: boolean;
    showtime: string;
    rows?: number;
    seatsPerRow?: number;
}) {
    const rowLetters = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
    ];
    const [seats, setSeats] = useState<Seat[]>(() => {
        const initialSeats: Seat[] = [];
        for (let row = 1; row <= rows; row++) {
            for (let number = 1; number <= seatsPerRow; number++) {
                initialSeats.push({
                    id: `${rowLetters[row - 1]}${number}`,
                    row,
                    number,
                    status: Math.random() > 0.8 ? "taken" : "available", // Randomly mark some seats as taken
                });
            }
        }
        return initialSeats;
    });
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [step, setStep] = useState<number>(1);
    const [allTheSeats, setAllTheSeats] = useState<Tickets[]>([
        { type: "normal", number: 0, price: 10 },
        { type: "student", number: 0, price: 8 },
        { type: "senior", number: 0, price: 6 },
        { type: "child", number: 0, price: 5 },
    ]);
    const [totalSeats, setTotalSeats] = useState<number>(0);
    const [full, setFull] = useState<boolean>(false);
    const { toast } = useToast();
    const [reservation, setReservation] = useState<Reservation>({
        userId: 1,
        showtimeId: 1,
        seats: [],
        totalPrice: 0,
    });
    const [cardInformations, setCardInformations] = useState<Card>({
        name: "",
        cardNumber: "",
        expirationDate: "",
        securityCode: "",
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        setTotalSeats(allTheSeats.reduce((acc, seat) => acc + seat.number, 0));
        if (totalSeats === selectedSeats.length) {
            setFull(true);
        } else {
            setFull(false);
        }
    }, [allTheSeats, selectedSeats, totalSeats]);

    const toggleSeat = (id: string) => {
        if (seats.find((seat) => seat.id === id)?.status === "selected") {
            setSelectedSeats((prevSelectedSeats) =>
                prevSelectedSeats.filter((prev) => prev !== id)
            );
        } else {
            setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, id]);
        }
        setSeats((prevSeats) =>
            prevSeats.map((seat) =>
                seat.id === id && seat.status !== "taken"
                    ? {
                          ...seat,
                          status:
                              seat.status === "available"
                                  ? "selected"
                                  : "available",
                      }
                    : seat
            )
        );
    };

    const getButtonVariant = (status: Seat["status"]) => {
        switch (status) {
            case "available":
                return "outline";
            case "selected":
                return "default";
            case "taken":
                return "ghost";
        }
    };

    const submitReservation = async (reservation: Reservation) => {
        console.log(reservation);
        try {
            const response = await fetch("/api/reservations", {
                method: "POST",
                body: JSON.stringify(reservation),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error creating reservation:", error);
        }
    };

    const handleNextStep = () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            if (totalSeats < selectedSeats.length) {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Vous avez sélectionné trop de places",
                });
            } else if (selectedSeats.length === 0) {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Vous devez sélectionner au moins une place",
                });
            } else if (selectedSeats.length < totalSeats) {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Vous devez sélectionner toutes les places",
                });
            } else {
                setReservation((prev) => ({
                    ...prev,
                    seats: selectedSeats,
                    totalPrice: allTheSeats.reduce(
                        (acc, seat) => acc + seat.price * seat.number,
                        0
                    ),
                }));
                setStep(3);
            }
        } else if (step === 3) {
            if (cardInformations.cardNumber.length !== 16) {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Le numéro de carte est invalide",
                });
            } else if (cardInformations.expirationDate.length !== 5) {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "La date d'expiration est invalide",
                });
            } else if (cardInformations.securityCode.length !== 3) {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Le code de sécurité est invalide",
                });
            } else {
                setLoading(true);
                setReservation((prev) => ({
                    ...prev,
                    reservationDate: new Date().toISOString(),
                }));
                submitReservation(reservation);
                // setTimeout(() => {
                //     setLoading(false);
                //     setIsOpen(false);
                //     setStep(1);
                //     toast({
                //         variant: "default",
                //         title: "Réservation effectuée",
                //         description: "Vous avez réservé les places",
                //     });
                //     setReservation({
                //         userId: 0,
                //         showtime: 0,
                //         seats: [],
                //         totalPrice: 0,
                //     });
                //     setSelectedSeats([]);
                //     setAllTheSeats([
                //         { type: "normal", number: 0, price: 10 },
                //         { type: "student", number: 0, price: 8 },
                //         { type: "senior", number: 0, price: 6 },
                //         { type: "child", number: 0, price: 5 },
                //     ]);
                // }, 2000);
            }
        }
    };

    const handlePreviousStep = () => {
        if (step === 2) {
            setStep(1);
        } else if (step === 3) {
            setStep(2);
        }
    };

    const handleSlide = () => {
        if (step === 1) {
            return "translate-x-full";
        } else if (step === 2) {
            return "translate-x-0";
        } else if (step === 3) {
            return "-translate-x-full";
        }
    };

    const displayTitle = () => {
        switch (step) {
            case 1:
                return "Sélectionner le nombre de places";
            case 2:
                return "Sélectionner les places";
            case 3:
                return "Récapitulatif";
        }
    };

    const displayButtonName = (element?: React.ReactNode) => {
        if (element) {
            return element;
        } else {
            switch (step) {
                case 1:
                    return "étape suivante";
                case 2:
                    return "étape suivante";
                case 3:
                    return "Valider le paiement";
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button disabled={disabled}>{children}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{displayTitle()}</DialogTitle>
                    <DialogDescription>
                        {`Séance de ${showtime}`}
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full overflow-hidden">
                    <div
                        className={cn(
                            "grid grid-cols-[100%_100%_100%] justify-center w-full transition-all duration-300",
                            handleSlide()
                        )}>
                        <div className="flex flex-col gap-2 py-2 w-full justify-center">
                            {allTheSeats.map((num) => {
                                return (
                                    <div
                                        className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center"
                                        key={num.type}>
                                        <Label
                                            htmlFor="number-of-seats"
                                            className="text-sm font-medium capitalize">
                                            {num.type} - <b>{num.price} €</b>
                                        </Label>
                                        <div className="flex gap-2">
                                            <Button
                                                disabled={num.number <= 0}
                                                variant={"outline"}
                                                onClick={() => {
                                                    setAllTheSeats(
                                                        (prevSeats) => {
                                                            return prevSeats.map(
                                                                (seat) => {
                                                                    if (
                                                                        seat.type ===
                                                                            num.type &&
                                                                        seat.number >
                                                                            0
                                                                    ) {
                                                                        return {
                                                                            ...seat,
                                                                            number:
                                                                                seat.number -
                                                                                1,
                                                                        };
                                                                    }
                                                                    return seat;
                                                                }
                                                            );
                                                        }
                                                    );
                                                }}>
                                                <MinusIcon />
                                            </Button>
                                            <Button
                                                variant={"ghost"}
                                                className="hover:bg-transparent cursor-default">
                                                {num.number}
                                            </Button>
                                            <Button
                                                variant={"outline"}
                                                onClick={() => {
                                                    setAllTheSeats(
                                                        (prevSeats) => {
                                                            return prevSeats.map(
                                                                (seat) => {
                                                                    if (
                                                                        seat.type ===
                                                                            num.type &&
                                                                        seat.number <
                                                                            10
                                                                    ) {
                                                                        return {
                                                                            ...seat,
                                                                            number:
                                                                                seat.number +
                                                                                1,
                                                                        };
                                                                    }
                                                                    return seat;
                                                                }
                                                            );
                                                        }
                                                    );
                                                }}>
                                                <PlusIcon />
                                            </Button>
                                        </div>
                                        <div className="w-full flex justify-end">
                                            {num.price * num.number} €
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="grid gap-2 py-2 justify-center w-full">
                            <div
                                style={{
                                    gridTemplateColumns: `repeat(${seatsPerRow}, minmax(0, 1fr))`,
                                    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                                    gap: "0.5rem",
                                    display: "grid",
                                }}>
                                {seats.map((seat) => (
                                    <Seat
                                        full={full}
                                        key={seat.id}
                                        seat={seat}
                                        getButtonVariant={getButtonVariant}
                                        toggleSeat={toggleSeat}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 grid-rows-3 gap-2 p-2 justify-center items-center h-fit">
                            <Input
                                className="col-span-4 row-span-1"
                                placeholder="Nom"
                                onChange={(e) =>
                                    setCardInformations({
                                        ...cardInformations,
                                        name: e.target.value,
                                    })
                                }
                            />
                            <div className="col-span-4 row-span-1 grid grid-cols-4 gap-2 border rounded-md border-zinc-800">
                                <Input
                                    className="border-none focus-visible:border-none focus-visible:ring-0 col-span-3"
                                    placeholder="Numéro de la carte"
                                    onChange={(e) =>
                                        setCardInformations({
                                            ...cardInformations,
                                            cardNumber: e.target.value,
                                        })
                                    }
                                />
                                {cardInformations.cardNumber.startsWith(
                                    "4"
                                ) && (
                                    <div className="col-span-1 row-span-1 flex justify-end p-1 items-center">
                                        <Image
                                            src="/visa.png"
                                            alt="Visa"
                                            width={40}
                                            height={50}
                                        />
                                    </div>
                                )}
                            </div>
                            <Input
                                className="col-span-2 row-span-1"
                                placeholder="Date d'expiration"
                                onChange={(e) =>
                                    setCardInformations({
                                        ...cardInformations,
                                        expirationDate: e.target.value,
                                    })
                                }
                            />
                            <Input
                                className="col-span-2 row-span-1"
                                placeholder="Code de sécurité"
                                onChange={(e) =>
                                    setCardInformations({
                                        ...cardInformations,
                                        securityCode: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex justify-between w-full">
                        <Button
                            variant={"outline"}
                            disabled={step === 1}
                            onClick={() => handlePreviousStep()}>
                            Retour
                        </Button>
                        <Button
                            className="capitalize"
                            onClick={() => handleNextStep()}>
                            {loading && (
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {displayButtonName()}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
