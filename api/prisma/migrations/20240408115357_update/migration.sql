/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Token` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "exp" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Token" ("createdAt", "exp", "id", "scope", "sub", "updatedAt", "value") SELECT "createdAt", "exp", "id", "scope", "sub", "updatedAt", "value" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
CREATE UNIQUE INDEX "Token_value_key" ON "Token"("value");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
