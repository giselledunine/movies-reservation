"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
//import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useUserStore } from "@/stores/userStore";

// interface User {
//     firstname: string;
//     lastname: string;
//     email: string;
//     password: string;
//     role: string;
//     phone_number: string;
// }

function RegisterForm() {
    const route = useRouter();
    const formSchema = z.object({
        firstname: z.string(),
        lastname: z.string(),
        email: z
            .string()
            .email({ message: "L'adresse mail n'a pas le bon format" }),
        password: z
            .string()
            .min(8, {
                message: "Password must be at least 8 characters long",
            })
            .regex(/[a-z]/, {
                message: "Password must contain at least one lowercase letter",
            })
            .regex(/[A-Z]/, {
                message: "Password must contain at least one uppercase letter",
            })
            .regex(/[0-9]/, {
                message: "Password must contain at least one number",
            })
            .regex(/[\W_]/, {
                message: "Password must contain at least one special character",
            }),
        phone_number: z.string().refine(
            (val) => {
                // Custom logic: Example for US phone numbers (10 digits)
                return /^\d{10}$/.test(val) || /^\+1\d{10}$/.test(val);
            },
            {
                message:
                    "Phone number must be in the format 1234567890 or +11234567890",
            }
        ),
        role: z.string(),
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            phone_number: "",
            role: "user",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const datas = {
            ...values,
            clearPassword: values.password,
        };
        try {
            await fetch("/api/users", {
                method: "POST",
                body: JSON.stringify(datas),
            });
            route.push("/");
        } catch (err) {
            return err;
        }

        // Do something with the form values.
        // ✅ This will be type-safe and validated.
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <Input placeholder="Prénom" {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom de Famille</FormLabel>
                            <Input placeholder="Nom de famille" {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adresse mail</FormLabel>
                            <Input placeholder="user@gmail.com" {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <Input
                                placeholder="••••••••"
                                type="password"
                                {...field}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nméro de téléphone</FormLabel>
                            <Input placeholder="0000000000" {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" variant={"secondary"}>
                    Submit
                </Button>
            </form>
        </Form>
    );
}

// function LoginForm() {
//     const route = useRouter();
//     const formSchema = z.object({
//         email: z
//             .string()
//             .email({ message: "L'adresse mail n'a pas le bon format" }),
//         password: z
//             .string()
//             .min(8, {
//                 message: "Password must be at least 8 characters long",
//             })
//             .regex(/[a-z]/, {
//                 message: "Password must contain at least one lowercase letter",
//             })
//             .regex(/[A-Z]/, {
//                 message: "Password must contain at least one uppercase letter",
//             })
//             .regex(/[0-9]/, {
//                 message: "Password must contain at least one number",
//             })
//             .regex(/[\W_]/, {
//                 message: "Password must contain at least one special character",
//             }),
//     });

//     // 1. Define your form.
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             email: "",
//             password: "",
//         },
//     });

//     // 2. Define a submit handler.
//     async function onSubmit(values: z.infer<typeof formSchema>) {
//         const datas = {
//             ...values,
//             clearPassword: values.password,
//             request_type: "login",
//         };
//         await fetch("/api/users", {
//             method: "POST",
//             body: JSON.stringify(datas),
//         })
//             .then(async (response) => {
//                 const res = await response.json();
//                 if (res?.status === "fail") {
//                     toast({
//                         variant: "destructive",
//                         title: "Erreur",
//                         description: res.errors.appError.message,
//                     });
//                 } else {
//                     route.push("/");
//                 }
//             })
//             .catch(async () => {
//                 toast({
//                     variant: "destructive",
//                     title: "Erreur",
//                     description: "Erreur Server",
//                 });
//             });
//         // Do something with the form values.
//         // ✅ This will be type-safe and validated.
//     }

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                 <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Adresse mail</FormLabel>
//                             <Input placeholder="user@gmail.com" {...field} />
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="password"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Mot de passe</FormLabel>
//                             <Input
//                                 placeholder="•••••••"
//                                 type="password"
//                                 {...field}
//                             />
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <Button type="submit" variant={"secondary"} className="w-full">
//                     Submit
//                 </Button>
//             </form>
//         </Form>
//     );
// }

export default function Login() {
    const [tabActiveElement, setTabActiveElement] = useState<string>("login");
    const route = useRouter();
    const { session } = useUserStore((state) => state);
    useEffect(() => {
        if (session) {
            route.push("/");
        }
    });
    return (
        <div className="grid grid-cols-[100%] sm:grid-cols-[50%_50%] h-[100%] w-full row-start-1 row-end-4 justify-center items-center">
            <div className="hidden sm:block w-[100%] h-[100%] bg-primary"></div>
            <div className="w-[100%] h-[100%] flex justify-center items-center">
                <Tabs
                    value={tabActiveElement}
                    onValueChange={setTabActiveElement}
                    className="w-full max-w-[320px]">
                    <TabsList className="w-full">
                        <TabsTrigger className="w-full" value="login">
                            Connexion
                        </TabsTrigger>
                        {/* <TabsTrigger className="w-full" value="register">
                            Inscription
                        </TabsTrigger> */}
                    </TabsList>
                    <TabsContent value="login">
                        <Card>
                            <CardContent className="space-y-2 mt-5">
                                {/* <LoginForm /> */}
                                <Button
                                    onClick={() => signIn("github")}
                                    className="w-full">
                                    Se connecter avec Github
                                    <Image
                                        className="ml-2 invert dark:invert-0"
                                        src="/github.png"
                                        alt="github"
                                        width={20}
                                        height={20}
                                    />
                                </Button>
                                <Button
                                    onClick={() => signIn("google")}
                                    className="w-full">
                                    Se connecter avec Google
                                    <Image
                                        className="ml-2"
                                        src="/google.png"
                                        alt="google"
                                        width={20}
                                        height={20}
                                    />
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="register">
                        <Card>
                            <CardContent className="space-y-2 mt-5">
                                <RegisterForm />
                                <Button
                                    onClick={() => signIn("github")}
                                    className="w-full">
                                    S&apos;inscrire avec Github
                                    <Image
                                        className="ml-2 invert dark:invert-0"
                                        src="/github.png"
                                        alt="github"
                                        width={20}
                                        height={20}
                                    />
                                </Button>
                                <Button
                                    onClick={() => signIn("google")}
                                    className="w-full">
                                    S&apos;inscrire avec Google
                                    <Image
                                        className="ml-2"
                                        src="/google.png"
                                        alt="google"
                                        width={20}
                                        height={20}
                                    />
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
