"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { z } from "zod";
import Cookies from "js-cookie";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    useMovieStore,
    MovieWithGenreAndShowtimes,
    AddMovieType,
    UpdateMovieType,
} from "@/stores/movieStore";
import { toast } from "@/hooks/use-toast";
import { Genre } from "@prisma/client";
import { Calendar, Edit, Trash } from "lucide-react";

export function MoviesForm({
    genres,
    movie,
    setTabActiveElement,
}: {
    genres: Genre[];
    movie?: MovieWithGenreAndShowtimes;
    setTabActiveElement: (tab: string) => void;
}) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { addMovie, updateMovies } = useMovieStore((state) => state);
    const image = movie ? movie.movie_poster : "/logo-movies.png";
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedImage(URL.createObjectURL(file)); // Prévisualisation de l'image

            // Mettre à jour la valeur du champ "image" dans react-hook-form
            form.setValue("movie_poster", file);
        }
    };

    // MultiSelect Component
    function MultiSelect({
        options,
        selectedOptions,
        onChange,
    }: {
        options: Genre[];
        selectedOptions: number[];
        onChange: (selectedOptions: number[]) => void;
    }) {
        const handleOptionToggle = (option: number) => {
            onChange(
                selectedOptions.includes(option)
                    ? selectedOptions.filter((item) => item !== option)
                    : [...selectedOptions, option]
            );
        };

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                        {selectedOptions.length > 0
                            ? selectedOptions
                                  .map(
                                      (selectedOption: number) =>
                                          genres.find(
                                              (genre) =>
                                                  genre.genre_id ===
                                                  selectedOption
                                          )?.genre_name
                                  )
                                  .join(", ")
                            : "Choisissez les genres"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[300px] overflow-y:auto">
                    <DropdownMenuLabel>Genres</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {options.map((option) => (
                        <DropdownMenuCheckboxItem
                            key={option.genre_id}
                            checked={selectedOptions.includes(option.genre_id)}
                            onCheckedChange={() =>
                                handleOptionToggle(option.genre_id)
                            }>
                            {option.genre_name}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    const formSchemaAdd = z.object({
        movie_title: z
            .string()
            .min(1, { message: "The title must be written" })
            .max(50, { message: "The title must be shorter" }),
        movie_description: z
            .string()
            .min(5, { message: "The description must be longer" })
            .max(200, { message: "The description must be shorter" }),
        movie_poster: z
            .instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, {
                // 5MB limit
                message: "File size should be less than 5MB",
            })
            .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
                message: "Only JPEG or PNG images are allowed",
            }),
        genre_id: z
            .string()
            .refine(
                (val) => genres.map((genre) => genre.genre_id == Number(val)),
                "La valeur n'est pas autorisée"
            ),
        movie_duration: z
            .number()
            .max(400, "The movie can't be mongueur than 3h30")
            .min(10, "The movie can't be shorter than 10 mins"),
    });
    const formSchemaUpdate = z.object({
        movie_title: z
            .string()
            .min(1, { message: "The title must be written" })
            .max(50, { message: "The title must be shorter" }),
        movie_description: z
            .string()
            .min(5, { message: "The description must be longer" })
            .max(200, { message: "The description must be shorter" }),
        movie_poster: z
            .instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, {
                // 5MB limit
                message: "File size should be less than 5MB",
            })
            .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
                message: "Only JPEG or PNG images are allowed",
            })
            .optional(),
        genres: z.array(z.number()),
        movie_duration: z
            .number()
            .max(400, "The movie can't be mongueur than 3h30")
            .min(10, "The movie can't be shorter than 10 mins"),
    });
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchemaUpdate>>({
        // resolver: zodResolver(movie ? formSchemaUpdate : formSchemaAdd),
        resolver: zodResolver(formSchemaUpdate),
        defaultValues: {
            movie_title: movie ? movie.movie_title : "",
            movie_description: movie ? movie.movie_description : "",
            movie_poster: undefined,
            genres: movie ? movie.genres.map((genre) => genre.genre_id) : [],
            movie_duration: movie ? movie.movie_duration : 120,
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(
        values: z.infer<typeof formSchemaAdd> | z.infer<typeof formSchemaUpdate>
    ) {
        // const datas: typeof values & {
        //     previous_image_fullpath: string | undefined;
        //     movie_id: number | undefined;
        // } = {
        //     ...values,
        //     previous_image_fullpath: undefined,
        //     movie_id: undefined,
        if (movie) {
            const datas = {
                ...values,
                movie_id: movie.movie_id,
                previous_image_fullpath: movie.movie_poster_fullpath,
            };
            await updateMovies(datas as UpdateMovieType)
                .then((res) => {
                    toast({
                        variant: "default",
                        title: "Film modifié",
                        description: `Le film ${res.movie_title} a été modifié`,
                    });
                })
                .catch((err) => {
                    toast({
                        variant: "destructive",
                        title: "Erreur",
                        description: err,
                    });
                });
        } else {
            const filename = values.movie_poster?.name.replaceAll(" ", "_");
            const fullpath = `movies/${filename}`;
            const datas = {
                ...values,
                movie_poster_fullpath: fullpath,
            };
            await addMovie(datas as AddMovieType)
                .then((res) => {
                    toast({
                        variant: "default",
                        title: "Film ajouté",
                        description: `Le film ${res.movie_title} a été ajouté`,
                    });
                    setTabActiveElement("list");
                })
                .catch((err) => {
                    toast({
                        variant: "destructive",
                        title: "Erreur",
                        description: err,
                    });
                });
        }
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="movie_title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom du film</FormLabel>
                            <FormControl>
                                <Input
                                    type="string"
                                    placeholder="Entrez le nom du film"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="movie_description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description du film</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a little bit about the movie"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4">
                    <Image
                        src={selectedImage ? selectedImage : image}
                        alt={"poster"}
                        className="rounded-md dark:invert"
                        width={100}
                        height={50}
                    />
                    <FormField
                        control={form.control}
                        name="movie_poster"
                        render={() => (
                            <FormItem>
                                <FormLabel>Poster du film</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        placeholder="Ajoutez une image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="genres"
                    render={() => (
                        <FormItem>
                            <FormLabel>Genre du film</FormLabel>
                            <MultiSelect
                                options={genres}
                                selectedOptions={form.getValues("genres")}
                                onChange={(selected: number[]) =>
                                    form.setValue("genres", selected)
                                }
                            />
                            {/* <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value?.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Séléctionnez un genre" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {genres.map((genre: Genre, idx: number) => (
                                        <SelectItem
                                            key={idx}
                                            value={genre.genre_id?.toString()}>
                                            {genre.genre_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full" type="submit">
                    {movie ? "Modifier" : "Ajouter"}
                </Button>
            </form>
        </Form>
    );
}

export default function MoviesManagement() {
    const { movies, getMovies, removeMovies, genres, getGenres } =
        useMovieStore((state) => state);
    const [tabActiveElement, setTabActiveElement] = useState<string>("list");
    const router = useRouter();

    const handleRedirectProgrammation = (movie_id: number) => {
        Cookies.set("movie_id", movie_id.toString());
        router.push("/management/showtimes");
    };
    useEffect(() => {
        if (movies?.length == 0) {
            getMovies();
        }
        if (genres.length == 0) {
            getGenres();
        }
    }, [movies, genres, getMovies, getGenres]);

    const MovieRow = ({ movie }: { movie: MovieWithGenreAndShowtimes }) => {
        const [isOpenDelete, setIsOpenDelete] = useState(false);
        const handleDelete = async () => {
            removeMovies(movie.movie_id)
                .then(() => {
                    toast({
                        variant: "default",
                        title: "Film Supprimé",
                        description:
                            "Le film a bien été supprimé de la base de données",
                    });
                    setIsOpenDelete(false);
                })
                .catch(() => {
                    toast({
                        variant: "destructive",
                        title: "Erreur",
                        description: "Le film n'a pas pu être supprimé",
                    });
                });
        };

        return (
            <TableRow>
                <TableCell>
                    <Image
                        src={movie.movie_poster}
                        alt={movie.movie_title}
                        width={50}
                        height={50}
                        className="rounded-md"
                    />
                </TableCell>
                <TableCell>{movie.movie_title}</TableCell>
                <TableCell className="hidden sm:block">
                    {movie.movie_description}
                </TableCell>
                <TableCell className="hidden sm:block">
                    {movie.genres.map((genre) => genre.genre_name).join(",")}
                </TableCell>
                <TableCell align="right">
                    <div className="flex gap-2 w-fit">
                        <Button
                            variant="outline"
                            className="w-9 sm:w-fit"
                            onClick={() =>
                                handleRedirectProgrammation(movie.movie_id)
                            }>
                            <Calendar />
                            <p className="hidden sm:block">Programmation</p>
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-9 sm:w-fit">
                                    <Edit />
                                    <p className="hidden sm:block">Modifier</p>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Modifiez le film</DialogTitle>
                                    <DialogDescription>
                                        <MoviesForm
                                            movie={movie}
                                            genres={genres}
                                            setTabActiveElement={
                                                setTabActiveElement
                                            }
                                        />
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <Dialog
                            open={isOpenDelete}
                            onOpenChange={setIsOpenDelete}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="w-9 sm:w-fit">
                                    <Trash />
                                    <p className="hidden sm:block">Supprimer</p>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Êtes-vous totalement sûre ?
                                    </DialogTitle>
                                    <DialogDescription>
                                        Assurez-vous qu&apos;aucune séance ne
                                        soit programmée pour ce film, la
                                        suppression ne pourra se faire autrement
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        onClick={handleDelete}
                                        variant="destructive">
                                        Supprimer
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </TableCell>
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
                        Liste des films
                    </TabsTrigger>
                    <TabsTrigger className="w-full" value="add">
                        Ajouter un film
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                    <Table>
                        <TableCaption>A list of the movies.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Nom du film</TableHead>
                                <TableHead className="hidden sm:block">
                                    Description
                                </TableHead>
                                <TableHead className="hidden sm:block">
                                    Genre
                                </TableHead>
                                <TableHead align="right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {movies
                                ?.sort(
                                    (a, b) =>
                                        new Date(b.updated_at).getTime() -
                                        new Date(a.updated_at).getTime()
                                )
                                .map((movie) => (
                                    <MovieRow
                                        key={movie.movie_id}
                                        movie={movie}
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
                            <MoviesForm
                                genres={genres}
                                setTabActiveElement={setTabActiveElement}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
