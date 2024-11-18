import NextAuth from "next-auth";

declare module "next-auth" {
    // Étendre le typage de l'objet utilisateur
    interface User {
        role?: string; // Exemple : ajout de la clé "role"
        // Vous pouvez ajouter d'autres clés ici
    }

    // Étendre le typage de la session
    interface Session {
        user?: {
            user_id?: number;
            image?: string;
            email?: string;
            name?: string;
            role?: string; // Assurez-vous de refléter les clés de l'utilisateur ici
            // Ajoutez d'autres clés si nécessaire
        };
    }
}
