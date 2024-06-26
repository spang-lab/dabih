/*
  Warnings:

  - You are about to drop the column `mnemonic` on the `Dataset` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mnemonic]` on the table `Inode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mnemonic` to the `Inode` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Dataset_mnemonic_key";

-- AlterTable
ALTER TABLE "Dataset" DROP COLUMN "mnemonic";

-- AlterTable
ALTER TABLE "Inode" ADD COLUMN     "mnemonic" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Inode_mnemonic_key" ON "Inode"("mnemonic");
