/*
  Warnings:

  - Made the column `room_number` on table `Theater` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Theater" ALTER COLUMN "room_number" SET NOT NULL;
