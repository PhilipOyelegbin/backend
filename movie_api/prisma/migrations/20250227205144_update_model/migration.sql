/*
  Warnings:

  - You are about to drop the `blacklisttoken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "blacklisttoken";

-- CreateTable
CREATE TABLE "blacklisttokens" (
    "id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklisttokens_id_key" ON "blacklisttokens"("id");
