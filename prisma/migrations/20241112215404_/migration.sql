/*
  Warnings:

  - You are about to drop the column `genre_id` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `prout` on the `Showtime` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "movies_genre_id";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "genre_id";

-- AlterTable
ALTER TABLE "Showtime" DROP COLUMN "prout";

-- CreateTable
CREATE TABLE "_MovieGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MovieGenres_AB_unique" ON "_MovieGenres"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieGenres_B_index" ON "_MovieGenres"("B");

-- AddForeignKey
ALTER TABLE "_MovieGenres" ADD CONSTRAINT "_MovieGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("genre_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieGenres" ADD CONSTRAINT "_MovieGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("movie_id") ON DELETE CASCADE ON UPDATE CASCADE;
