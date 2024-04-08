/*
  Warnings:

  - Added the required column `updatedAt` to the `PublicKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Chunk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Dataset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Key` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PublicKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "isRootKey" BOOLEAN NOT NULL,
    "enabled" DATETIME,
    "enabledBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "PublicKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PublicKey" ("data", "enabled", "enabledBy", "hash", "id", "isRootKey", "userId") SELECT "data", "enabled", "enabledBy", "hash", "id", "isRootKey", "userId" FROM "PublicKey";
DROP TABLE "PublicKey";
ALTER TABLE "new_PublicKey" RENAME TO "PublicKey";
CREATE TABLE "new_Chunk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datasetId" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "crc" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Chunk_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chunk" ("crc", "datasetId", "end", "hash", "id", "iv", "size", "start") SELECT "crc", "datasetId", "end", "hash", "id", "iv", "size", "start" FROM "Chunk";
DROP TABLE "Chunk";
ALTER TABLE "new_Chunk" RENAME TO "Chunk";
CREATE TABLE "new_Dataset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mnemonic" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "name" TEXT,
    "path" TEXT,
    "hash" TEXT,
    "size" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);
INSERT INTO "new_Dataset" ("createdBy", "fileName", "hash", "id", "keyHash", "mnemonic", "name", "path", "size") SELECT "createdBy", "fileName", "hash", "id", "keyHash", "mnemonic", "name", "path", "size" FROM "Dataset";
DROP TABLE "Dataset";
ALTER TABLE "new_Dataset" RENAME TO "Dataset";
CREATE UNIQUE INDEX "Dataset_mnemonic_key" ON "Dataset"("mnemonic");
CREATE TABLE "new_Key" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datasetId" INTEGER NOT NULL,
    "publicKeyHash" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Key_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Key" ("datasetId", "id", "key", "publicKeyHash") SELECT "datasetId", "id", "key", "publicKeyHash" FROM "Key";
DROP TABLE "Key";
ALTER TABLE "new_Key" RENAME TO "Key";
CREATE TABLE "new_Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sub" TEXT NOT NULL,
    "datasetId" INTEGER NOT NULL,
    "permission" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Member_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("datasetId", "id", "permission", "sub") SELECT "datasetId", "id", "permission", "sub" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
CREATE TABLE "new_Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "exp" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);
INSERT INTO "new_Token" ("exp", "id", "scope", "sub", "value") SELECT "exp", "id", "scope", "sub", "value" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
CREATE UNIQUE INDEX "Token_value_key" ON "Token"("value");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
