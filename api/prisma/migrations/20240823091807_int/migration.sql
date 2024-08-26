/*
  Warnings:

  - You are about to alter the column `type` on the `Inode` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `permission` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Inode" ALTER COLUMN "type" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "permission" SET DATA TYPE INTEGER;
