/*
  Warnings:

  - You are about to drop the column `datasetId` on the `Chunk` table. All the data in the column will be lost.
  - You are about to drop the column `datasetId` on the `Inode` table. All the data in the column will be lost.
  - You are about to drop the column `datasetId` on the `Key` table. All the data in the column will be lost.
  - You are about to drop the `Dataset` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileDataId` to the `Chunk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileDataId` to the `Key` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chunk" DROP CONSTRAINT "Chunk_datasetId_fkey";

-- DropForeignKey
ALTER TABLE "Inode" DROP CONSTRAINT "Inode_datasetId_fkey";

-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_datasetId_fkey";

-- AlterTable
ALTER TABLE "Chunk" DROP COLUMN "datasetId",
ADD COLUMN     "fileDataId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Inode" DROP COLUMN "datasetId",
ADD COLUMN     "fileDataId" INTEGER;

-- AlterTable
ALTER TABLE "Key" DROP COLUMN "datasetId",
ADD COLUMN     "fileDataId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Dataset";

-- CreateTable
CREATE TABLE "FileData" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT,
    "hash" TEXT,
    "size" INTEGER,
    "keyHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FileData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileData_uid_key" ON "FileData"("uid");

-- AddForeignKey
ALTER TABLE "Chunk" ADD CONSTRAINT "Chunk_fileDataId_fkey" FOREIGN KEY ("fileDataId") REFERENCES "FileData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inode" ADD CONSTRAINT "Inode_fileDataId_fkey" FOREIGN KEY ("fileDataId") REFERENCES "FileData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_fileDataId_fkey" FOREIGN KEY ("fileDataId") REFERENCES "FileData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
