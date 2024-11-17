/*
  Warnings:

  - Made the column `movie_title` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `movie_description` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `movie_poster` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genre_id` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `movie_duration` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `movie_poster_fullpath` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "movie_title" SET NOT NULL,
ALTER COLUMN "movie_description" SET NOT NULL,
ALTER COLUMN "movie_poster" SET NOT NULL,
ALTER COLUMN "genre_id" SET NOT NULL,
ALTER COLUMN "movie_duration" SET NOT NULL,
ALTER COLUMN "movie_poster_fullpath" SET NOT NULL;
