/*
  Warnings:

  - You are about to drop the column `ticket_price` on the `reservations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "ticket_price",
ALTER COLUMN "total_price" DROP NOT NULL;
