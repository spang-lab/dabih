/*
  Warnings:

  - A unique constraint covering the columns `[userId,hash]` on the table `PublicKey` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PublicKey_userId_hash_key" ON "PublicKey"("userId", "hash");
