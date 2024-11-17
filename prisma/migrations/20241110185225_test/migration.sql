/*
  Warnings:

  - You are about to drop the column `prout` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "prout";

-- AlterTable
ALTER TABLE "Showtime" ADD COLUMN     "prout" TEXT;
