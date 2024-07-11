/*
  Warnings:

  - You are about to drop the column `dataId` on the `Key` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_dataId_fkey";

-- AlterTable
ALTER TABLE "Key" DROP COLUMN "dataId";
