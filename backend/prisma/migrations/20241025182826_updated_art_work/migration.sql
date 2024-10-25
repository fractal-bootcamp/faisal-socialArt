-- AlterTable
ALTER TABLE "ArtWork" ADD COLUMN     "isAuthor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userAvatar" TEXT,
ADD COLUMN     "userName" TEXT;
