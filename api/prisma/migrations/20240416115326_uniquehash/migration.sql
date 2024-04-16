/*
  Warnings:

  - You are about to drop the column `userId` on the `Key` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hash]` on the table `PublicKey` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PublicKey_userId_hash_key";

-- AlterTable
ALTER TABLE "Key" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "PublicKey_hash_key" ON "PublicKey"("hash");
