/*
  Warnings:

  - Added the required column `inodeId` to the `Key` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "inodeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_inodeId_fkey" FOREIGN KEY ("inodeId") REFERENCES "Inode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
