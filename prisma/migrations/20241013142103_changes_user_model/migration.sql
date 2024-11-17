/*
  Warnings:

  - You are about to drop the `cards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `movies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reservations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `showtimes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `theaters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_genre_id";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "fk_movie";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_showtime_id_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "showtimes" DROP CONSTRAINT "fk_theatre";

-- DropForeignKey
ALTER TABLE "showtimes" DROP CONSTRAINT "showtimes_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "fk_card";

-- DropTable
DROP TABLE "cards";

-- DropTable
DROP TABLE "genres";

-- DropTable
DROP TABLE "movies";

-- DropTable
DROP TABLE "reservations";

-- DropTable
DROP TABLE "showtimes";

-- DropTable
DROP TABLE "theaters";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Card" (
    "card_id" SERIAL NOT NULL,
    "card_number" INTEGER NOT NULL,
    "card_name" VARCHAR NOT NULL,
    "expiration_date" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("card_id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "genre_id" SERIAL NOT NULL,
    "genre_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("genre_id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "movie_title" VARCHAR(255),
    "movie_description" VARCHAR(255),
    "movie_poster" VARCHAR(255),
    "genre_id" INTEGER,
    "movie_id" SERIAL NOT NULL,
    "movie_duration" INTEGER NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("movie_id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "reservation_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "showtime_id" INTEGER,
    "seats" TEXT[],
    "total_price" INTEGER NOT NULL,
    "movie_id" INTEGER,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateTable
CREATE TABLE "Showtime" (
    "showtime_id" SERIAL NOT NULL,
    "movie_id" INTEGER,
    "show_date" TIMESTAMP(6) NOT NULL,
    "theater_id" INTEGER NOT NULL,
    "available_seats" INTEGER NOT NULL,

    CONSTRAINT "Showtime_pkey" PRIMARY KEY ("showtime_id")
);

-- CreateTable
CREATE TABLE "Theater" (
    "theater_id" SERIAL NOT NULL,
    "rows" INTEGER NOT NULL,
    "columns" INTEGER NOT NULL,
    "room_number" INTEGER,

    CONSTRAINT "theatres_pkey" PRIMARY KEY ("theater_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "firstname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "saved_card" INTEGER,
    "password" VARCHAR NOT NULL,
    "lastname" VARCHAR NOT NULL,
    "role" VARCHAR NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Theater_room_number_key" ON "Theater"("room_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "movies_genre_id" FOREIGN KEY ("genre_id") REFERENCES "Genre"("genre_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "fk_movie" FOREIGN KEY ("movie_id") REFERENCES "Movie"("movie_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "Showtime"("showtime_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "fk_theatre" FOREIGN KEY ("theater_id") REFERENCES "Theater"("theater_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("movie_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "fk_card" FOREIGN KEY ("saved_card") REFERENCES "Card"("card_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
