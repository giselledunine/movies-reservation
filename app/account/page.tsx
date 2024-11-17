"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useUserStore } from "@/stores/userStore";

export default function MyAccount() {
    const { session } = useUserStore((state) => state);
    return (
        <div className="row-start-2">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Account Infos</CardTitle>
                    <CardDescription>
                        Consultez et modifiez les informations de votre profil
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="font-bold">Avatar</p>
                    <Image
                        className=" mt-4"
                        src={session?.user?.image as string}
                        alt="profilImage"
                        width={50}
                        height={50}
                    />
                    <Separator className="mt-4" />
                    <p className="font-bold  mt-4">Name</p>
                    <p className="mt-2">{session?.user?.name}</p>
                    <Separator className="mt-4" />
                    <p className="font-bold mt-4">Email</p>
                    <p className="mt-2">{session?.user?.email}</p>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        variant="destructive"
                        onClick={() => signOut()}>
                        Déconnexion
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
