"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useTheatreStore } from "@/stores/theatreStore";
import { Prisma, Theater } from "@prisma/client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogDescription,
    DialogContent,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

export default function TheaterManagement() {
    const theaters = useTheatreStore((state) => state.theaters);
    const getTheaters = useTheatreStore((state) => state.getTheaters);
    const removeTheater = useTheatreStore((state) => state.removeTheater);
    const addTheater = useTheatreStore((state) => state.addTheater);
    const updateTheater = useTheatreStore((state) => state.updateTheater);
    const [tabActiveElement, setTabActiveElement] = useState<string>("list");
    const [roomNumbersAvailable, setRoomNumberAvailable] = useState<number[]>([
        1,
    ]);
    const initialRooms = Array.from({ length: 31 }, (_, idx) => idx + 1);
    const { toast } = useToast();

    const handleDelete = async (theaterID: number) => {
        try {
            const response = await removeTheater(theaterID);
            if (!response.ok) {
                toast({
                    variant: "destructive",
                    title: "La salle ne peux pas être supprimée",
                    description: `La salle semble avoir des réservations`,
                });
                throw new Error("Erreur lors de la suppression"); // Lance une erreur si la réponse est mauvaise
            } else {
                toast({
                    variant: "default",
                    title: "La salle a été supprimée",
                });
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de la salle", error);
        }
    };

    function TheatreForm({
        updating,
        theater,
        setTabActiveElement,
    }: {
        updating: boolean;
        theater?: Prisma.TheaterCreateInput & { theater_id: number };
        setTabActiveElement: (tab: string) => void;
    }) {
        const formSchema = z.object({
            room_number: z
                .string()
                .refine(
                    (val) =>
                        updating
                            ? [
                                  ...roomNumbersAvailable,
                                  ...(theater?.room_number
                                      ? [theater.room_number]
                                      : []),
                              ].includes(Number(val))
                            : roomNumbersAvailable.includes(Number(val)),
                    "La valeur n'est pas autorisée"
                ),
            rows: z
                .number()
                .int()
                .positive()
                .gt(5, { message: "The number of rows must be greater than 5" })
                .lt(40, { message: "The number of rows must be less than 40" }),
            columns: z
                .number()
                .int()
                .positive()
                .gt(5, {
                    message:
                        "The number of seats per row must be greater than 5",
                })
                .lt(40, {
                    message: "The number of seats per row must be less than 40",
                }),
        });

        // 1. Define your form.
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                room_number:
                    theater?.room_number.toString() ||
                    roomNumbersAvailable[0].toString(),
                rows: theater?.rows || 8,
                columns: theater?.columns || 10,
            },
        });

        // 2. Define a submit handler.
        async function onSubmit(values: z.infer<typeof formSchema>) {
            const datas: {
                theater: Prisma.TheaterCreateInput;
                theater_id?: number;
            } = {
                theater: { ...values, room_number: Number(values.room_number) },
            };
            if (updating) {
                datas.theater_id = theater?.theater_id;
                try {
                    await updateTheater(datas);
                    toast({
                        variant: "default",
                        title: "Salle modifiée",
                        description: `La salle numéro ${values.room_number} a bien été modifiée`,
                    });
                    setTabActiveElement("list");
                } catch (error) {
                    toast({
                        variant: "destructive",
                        title: "Erreur",
                        description: `La salle numéro ${values.room_number} n'a pas pu être modifié`,
                    });
                }
            } else {
                try {
                    await addTheater(datas);
                    toast({
                        variant: "default",
                        title: "Salle ajoutée",
                        description: `La salle numéro ${values.room_number} a bien été ajoutée`,
                    });
                    setTabActiveElement("list");
                } catch (error) {
                    console.error(
                        `Erreur lors de l'ajout de la salle ${values.room_number}`,
                        error
                    );
                }
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
                        name="room_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Numéro de la salle</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Séléctionnez un numéro de salle" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {updating
                                            ? [
                                                  ...roomNumbersAvailable,
                                                  ...(theater?.room_number
                                                      ? [theater.room_number]
                                                      : []),
                                              ]
                                                  ?.sort((a, b) => a - b)
                                                  ?.map((room, idx) => (
                                                      <SelectItem
                                                          key={idx}
                                                          value={room.toString()}>
                                                          {room}
                                                      </SelectItem>
                                                  ))
                                            : roomNumbersAvailable.map(
                                                  (room, idx) => (
                                                      <SelectItem
                                                          key={idx}
                                                          value={room.toString()}>
                                                          {room}
                                                      </SelectItem>
                                                  )
                                              )}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    This is number of rows in the theatre
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rows"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de rangées</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Entrez le nombre de rangées"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(
                                                value === ""
                                                    ? undefined
                                                    : Number(value)
                                            );
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is number of rows in the theatre
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="columns"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Nombre de sièges par rangée
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Entrez le nombre de sièges par rangée"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(
                                                value === ""
                                                    ? undefined
                                                    : Number(value)
                                            );
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is number of seats per row in the
                                    theatre
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        );
    }

    useEffect(() => {
        if (theaters.length === 0) {
            getTheaters();
        }
    }, [theaters, getTheaters]);

    useEffect(() => {
        const rooms = theaters.map((theater) => theater.room_number);
        const setAvailable = initialRooms.filter(
            (available) => !rooms.includes(available)
        );
        setRoomNumberAvailable(setAvailable);
    }, [theaters, initialRooms]);

    const TheatreRow = ({ theater }: { key: number; theater: Theater }) => {
        const [isUpdating, setIsUpdating] = useState(false);
        return (
            <TableRow>
                <TableCell className="font-medium">
                    {theater.room_number}
                </TableCell>
                <TableCell>{theater.rows}</TableCell>
                <TableCell>{theater.columns}</TableCell>
                <TableCell align="right">
                    <div className="flex gap-2 w-fit">
                        <Button
                            variant={"outline"}
                            onClick={() => setIsUpdating(true)}>
                            <Edit />
                            <p className="hidden : sm:block">Modifier</p>
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash />
                                    <p className="hidden : sm:block">
                                        Supprimer
                                    </p>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Supprimer la salle
                                    </DialogTitle>
                                    <DialogDescription>
                                        Êtes-vous sûr de vouloir supprimer la
                                        salle ? Assurez-vous qu&apos;aucune
                                        séance n&apos;est prévue dans cette
                                        salle
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        variant={"destructive"}
                                        onClick={() =>
                                            handleDelete(theater.theater_id)
                                        }>
                                        Supprimer
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </TableCell>
                <Dialog open={isUpdating} onOpenChange={setIsUpdating}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Modifiez la salle</DialogTitle>
                            <DialogDescription>
                                Modifiez les informations de la salle de cinéma
                            </DialogDescription>
                        </DialogHeader>
                        <TheatreForm
                            updating={isUpdating}
                            theater={theater}
                            setTabActiveElement={setTabActiveElement}
                        />
                    </DialogContent>
                </Dialog>
            </TableRow>
        );
    };

    return (
        <div className="flex flex-col gap-4 items-center">
            <Tabs
                value={tabActiveElement}
                onValueChange={setTabActiveElement}
                className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger className="w-full" value="list">
                        Liste des salles
                    </TabsTrigger>
                    <TabsTrigger className="w-full" value="add">
                        Ajouter une salle
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                    <Table>
                        <TableCaption>A list of the theatres.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    Numéro
                                </TableHead>
                                <TableHead>Nombre de rangées</TableHead>
                                <TableHead>Sièges par rangées</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {theaters
                                .sort((a, b) => a.room_number - b.room_number)
                                .map((theater) => (
                                    <TheatreRow
                                        key={theater.theater_id}
                                        theater={theater}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="add">
                    <Card>
                        <CardHeader>
                            <CardTitle>Salle de cinéma</CardTitle>
                            <CardDescription>
                                Ajouter une salle de cinéma
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <TheatreForm
                                updating={false}
                                setTabActiveElement={setTabActiveElement}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
