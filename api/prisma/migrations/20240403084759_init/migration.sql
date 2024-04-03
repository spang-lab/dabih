-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sub" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "PublicKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "isRootKey" BOOLEAN NOT NULL,
    "enabled" DATETIME,
    "enabledBy" TEXT,
    CONSTRAINT "PublicKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dataset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mnemonic" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "name" TEXT,
    "path" TEXT,
    "hash" TEXT,
    "size" INTEGER
);

-- CreateTable
CREATE TABLE "Chunk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datasetId" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "crc" TEXT,
    CONSTRAINT "Chunk_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sub" TEXT NOT NULL,
    "datasetId" INTEGER NOT NULL,
    "permission" INTEGER NOT NULL,
    CONSTRAINT "Member_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Key" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datasetId" INTEGER NOT NULL,
    "publicKeyHash" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    CONSTRAINT "Key_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "exp" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "User_sub_key" ON "User"("sub");

-- CreateIndex
CREATE INDEX "PublicKey_userId_hash_idx" ON "PublicKey"("userId", "hash");

-- CreateIndex
CREATE UNIQUE INDEX "Dataset_mnemonic_key" ON "Dataset"("mnemonic");

-- CreateIndex
CREATE UNIQUE INDEX "Token_value_key" ON "Token"("value");
