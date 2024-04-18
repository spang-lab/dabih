/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Chunk` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Key` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chunk" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Key" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "deletedAt";
