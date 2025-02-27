/*
  Warnings:

  - You are about to drop the `BlacklistToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "BlacklistToken";

-- CreateTable
CREATE TABLE "blacklisttoken" (
    "id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklisttoken_id_key" ON "blacklisttoken"("id");
