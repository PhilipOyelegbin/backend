-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_expiration" TEXT,
ADD COLUMN     "reset_token" TEXT;

-- CreateTable
CREATE TABLE "BlacklistToken" (
    "id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistToken_id_key" ON "BlacklistToken"("id");
