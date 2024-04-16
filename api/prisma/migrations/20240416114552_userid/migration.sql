/*
  Warnings:

  - Added the required column `userId` to the `Key` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "userId" INTEGER NOT NULL;
