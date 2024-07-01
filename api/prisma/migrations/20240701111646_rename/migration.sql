/*
  Warnings:

  - You are about to drop the column `fileDataId` on the `Chunk` table. All the data in the column will be lost.
  - You are about to drop the column `fileDataId` on the `Key` table. All the data in the column will be lost.
  - You are about to drop the column `publicKeyHash` on the `Key` table. All the data in the column will be lost.
  - Added the required column `dataId` to the `Chunk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataId` to the `Key` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Key` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chunk" DROP CONSTRAINT "Chunk_fileDataId_fkey";

-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_fileDataId_fkey";

-- AlterTable
ALTER TABLE "Chunk" DROP COLUMN "fileDataId",
ADD COLUMN     "dataId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Key" DROP COLUMN "fileDataId",
DROP COLUMN "publicKeyHash",
ADD COLUMN     "dataId" INTEGER NOT NULL,
ADD COLUMN     "hash" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Chunk" ADD CONSTRAINT "Chunk_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "FileData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "FileData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
