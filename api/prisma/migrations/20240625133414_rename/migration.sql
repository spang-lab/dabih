/*
  Warnings:

  - You are about to drop the column `fileDataId` on the `Inode` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inode" DROP CONSTRAINT "Inode_fileDataId_fkey";

-- AlterTable
ALTER TABLE "Inode" DROP COLUMN "fileDataId",
ADD COLUMN     "dataId" INTEGER;

-- AddForeignKey
ALTER TABLE "Inode" ADD CONSTRAINT "Inode_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "FileData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
