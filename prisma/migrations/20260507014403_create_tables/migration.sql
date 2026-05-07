/*
  Warnings:

  - The `status` column on the `deliveries` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('processing', 'shipped', 'delivered');

-- AlterTable
ALTER TABLE "deliveries" DROP COLUMN "status",
ADD COLUMN     "status" "DeliveryStatus" NOT NULL DEFAULT 'processing';

-- DropEnum
DROP TYPE "DeliveyStatus";
