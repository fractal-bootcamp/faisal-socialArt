-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_artWorkId_fkey";

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_artWorkId_fkey" FOREIGN KEY ("artWorkId") REFERENCES "ArtWork"("id") ON DELETE CASCADE ON UPDATE CASCADE;
