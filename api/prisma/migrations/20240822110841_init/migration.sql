-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "sub" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicKey" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "hash" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "isRootKey" BOOLEAN NOT NULL,
    "enabled" TIMESTAMP(3),
    "enabledBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileData" (
    "id" BIGSERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT,
    "hash" TEXT,
    "size" BIGINT,
    "keyHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chunk" (
    "id" BIGSERIAL NOT NULL,
    "dataId" BIGINT NOT NULL,
    "hash" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "start" BIGINT NOT NULL,
    "end" BIGINT NOT NULL,
    "crc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inode" (
    "id" BIGSERIAL NOT NULL,
    "mnemonic" TEXT NOT NULL,
    "type" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT,
    "dataId" BIGINT,
    "parentId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" BIGSERIAL NOT NULL,
    "sub" TEXT NOT NULL,
    "inodeId" BIGINT NOT NULL,
    "permission" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Key" (
    "id" BIGSERIAL NOT NULL,
    "inodeId" BIGINT NOT NULL,
    "hash" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" BIGSERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "exp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_sub_key" ON "User"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "PublicKey_hash_key" ON "PublicKey"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "FileData_uid_key" ON "FileData"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Inode_mnemonic_key" ON "Inode"("mnemonic");

-- CreateIndex
CREATE UNIQUE INDEX "Member_sub_inodeId_key" ON "Member"("sub", "inodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_value_key" ON "Token"("value");

-- AddForeignKey
ALTER TABLE "PublicKey" ADD CONSTRAINT "PublicKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chunk" ADD CONSTRAINT "Chunk_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "FileData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inode" ADD CONSTRAINT "Inode_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "FileData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inode" ADD CONSTRAINT "Inode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Inode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_inodeId_fkey" FOREIGN KEY ("inodeId") REFERENCES "Inode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_inodeId_fkey" FOREIGN KEY ("inodeId") REFERENCES "Inode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
