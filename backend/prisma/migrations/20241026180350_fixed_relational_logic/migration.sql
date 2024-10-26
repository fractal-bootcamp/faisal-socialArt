/*
  Warnings:

  - You are about to drop the column `isAuthor` on the `ArtWork` table. All the data in the column will be lost.
  - You are about to drop the column `userAvatar` on the `ArtWork` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `ArtWork` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ArtWork" DROP COLUMN "isAuthor",
DROP COLUMN "userAvatar",
DROP COLUMN "userName";
