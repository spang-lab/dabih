/*
  Warnings:

  - A unique constraint covering the columns `[sub,datasetId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Member_sub_datasetId_key" ON "Member"("sub", "datasetId");
