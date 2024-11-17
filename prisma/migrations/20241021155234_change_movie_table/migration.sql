/*
  Warnings:

  - Made the column `user_id` on table `Reservation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `showtime_id` on table `Reservation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `movie_id` on table `Reservation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `movie_id` on table `Showtime` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_user_id_fkey";

-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "showtime_id" SET NOT NULL,
ALTER COLUMN "movie_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Showtime" ALTER COLUMN "movie_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
