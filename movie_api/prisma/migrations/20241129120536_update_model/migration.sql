/*
  Warnings:

  - You are about to drop the column `showtime` on the `movies` table. All the data in the column will be lost.
  - Added the required column `num_ticket` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theaterId` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_price` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Confirmed', 'Cancelled');

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "showtime",
ADD COLUMN     "show_time" TEXT;

-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "num_ticket" INTEGER NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "theaterId" TEXT NOT NULL,
ADD COLUMN     "ticket_price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "total_price" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone_number" TEXT;

-- CreateTable
CREATE TABLE "theaters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theaters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_theaterId_fkey" FOREIGN KEY ("theaterId") REFERENCES "theaters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
