/*
  Warnings:

  - You are about to drop the column `isDirty` on the `FileData` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Inode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FileData" DROP COLUMN "isDirty";

-- AlterTable
ALTER TABLE "Inode" DROP COLUMN "deletedAt";
