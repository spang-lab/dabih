/*
  Warnings:

  - You are about to drop the column `datasetId` on the `Member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sub,inodeId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inodeId` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_datasetId_fkey";

-- DropIndex
DROP INDEX "Member_sub_datasetId_key";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "datasetId",
ADD COLUMN     "inodeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Inode" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "datasetId" INTEGER,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Inode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_sub_inodeId_key" ON "Member"("sub", "inodeId");

-- AddForeignKey
ALTER TABLE "Inode" ADD CONSTRAINT "Inode_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inode" ADD CONSTRAINT "Inode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Inode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_inodeId_fkey" FOREIGN KEY ("inodeId") REFERENCES "Inode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
