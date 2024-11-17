/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reservation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Showtime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Theater` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "movies_genre_id";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_showtime_id_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "fk_movie";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Showtime" DROP CONSTRAINT "Showtime_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "Showtime" DROP CONSTRAINT "fk_theatre";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "fk_card";

-- DropTable
DROP TABLE "Card";

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "Movie";

-- DropTable
DROP TABLE "Reservation";

-- DropTable
DROP TABLE "Showtime";

-- DropTable
DROP TABLE "Theater";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "cards" (
    "card_id" SERIAL NOT NULL,
    "card_number" INTEGER NOT NULL,
    "card_name" VARCHAR NOT NULL,
    "expiration_date" INTEGER NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("card_id")
);

-- CreateTable
CREATE TABLE "genres" (
    "genre_id" SERIAL NOT NULL,
    "genre_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("genre_id")
);

-- CreateTable
CREATE TABLE "movies" (
    "movie_title" VARCHAR(255),
    "movie_description" VARCHAR(255),
    "movie_poster" VARCHAR(255),
    "genre_id" INTEGER,
    "movie_id" SERIAL NOT NULL,
    "movie_duration" INTEGER NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("movie_id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "reservation_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "showtime_id" INTEGER,
    "seats" TEXT[],
    "total_price" INTEGER NOT NULL,
    "movie_id" INTEGER,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateTable
CREATE TABLE "showtimes" (
    "showtime_id" SERIAL NOT NULL,
    "movie_id" INTEGER,
    "show_date" TIMESTAMP(6) NOT NULL,
    "theater_id" INTEGER NOT NULL,
    "available_seats" INTEGER NOT NULL,

    CONSTRAINT "showtimes_pkey" PRIMARY KEY ("showtime_id")
);

-- CreateTable
CREATE TABLE "theaters" (
    "theater_id" SERIAL NOT NULL,
    "rows" INTEGER NOT NULL,
    "columns" INTEGER NOT NULL,
    "room_number" INTEGER,

    CONSTRAINT "theatres_pkey" PRIMARY KEY ("theater_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "firstname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "saved_card" INTEGER,
    "password" VARCHAR NOT NULL,
    "lastname" VARCHAR NOT NULL,
    "role" VARCHAR NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "theaters_room_number_key" ON "theaters"("room_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_genre_id" FOREIGN KEY ("genre_id") REFERENCES "genres"("genre_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "fk_movie" FOREIGN KEY ("movie_id") REFERENCES "movies"("movie_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "showtimes"("showtime_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "showtimes" ADD CONSTRAINT "fk_theatre" FOREIGN KEY ("theater_id") REFERENCES "theaters"("theater_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "showtimes" ADD CONSTRAINT "showtimes_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("movie_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_card" FOREIGN KEY ("saved_card") REFERENCES "cards"("card_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
