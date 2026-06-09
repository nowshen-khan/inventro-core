/*
  Warnings:

  - The values [PERCIAL_RECEIVED] on the enum `PurchaseStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `branchId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `ProductExchange` table. All the data in the column will be lost.
  - The `exchangeAmount` column on the `ProductExchange` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `refundAmount` column on the `ProductExchange` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `branchId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `PurchaseReturn` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `SaleReturn` table. All the data in the column will be lost.
  - The `refundAmount` column on the `SaleReturn` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `warehouseId` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseId` on the `StockAdjustment` table. All the data in the column will be lost.
  - You are about to drop the column `destWarehouseId` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `sourceWarehouseId` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Branch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Warehouse` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productVariantId,locationId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `ProductExchange` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `PurchaseReturn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `SaleReturn` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `totalAmount` on the `SaleReturn` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sellingPrice` on the `SaleReturnItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `totalPrice` on the `SaleReturnItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `locationId` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `StockAdjustment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `StockAdjustment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destLocationId` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceLocationId` to the `Transfer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."LocationType" AS ENUM ('WAREHOUSE', 'OUTLET', 'TRANSIT');

-- CreateEnum
CREATE TYPE "public"."AdjustmentReason" AS ENUM ('DAMAGE', 'MISSING', 'FOUND', 'PHYSICAL_COUNT', 'SAMPLE');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."PurchaseStatus_new" AS ENUM ('PENDING', 'RECEIVED', 'PARTIAL_RECEIVED', 'CANCELLED');
ALTER TABLE "public"."Purchase" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Purchase" ALTER COLUMN "status" TYPE "public"."PurchaseStatus_new" USING ("status"::text::"public"."PurchaseStatus_new");
ALTER TYPE "public"."PurchaseStatus" RENAME TO "PurchaseStatus_old";
ALTER TYPE "public"."PurchaseStatus_new" RENAME TO "PurchaseStatus";
DROP TYPE "public"."PurchaseStatus_old";
ALTER TABLE "public"."Purchase" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Expense" DROP CONSTRAINT "Expense_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductExchange" DROP CONSTRAINT "ProductExchange_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Purchase" DROP CONSTRAINT "Purchase_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PurchaseReturn" DROP CONSTRAINT "PurchaseReturn_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Sale" DROP CONSTRAINT "Sale_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SaleReturn" DROP CONSTRAINT "SaleReturn_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Stock" DROP CONSTRAINT "Stock_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockAdjustment" DROP CONSTRAINT "StockAdjustment_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transfer" DROP CONSTRAINT "Transfer_destWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transfer" DROP CONSTRAINT "Transfer_sourceWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Warehouse" DROP CONSTRAINT "Warehouse_branchId_fkey";

-- DropIndex
DROP INDEX "public"."Stock_productVariantId_warehouseId_key";

-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "lastPurchaseAt" TIMESTAMP(3),
ADD COLUMN     "totalSpent" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Expense" DROP COLUMN "branchId",
ADD COLUMN     "locationId" TEXT;

-- AlterTable
ALTER TABLE "public"."ProductExchange" DROP COLUMN "branchId",
ADD COLUMN     "locationId" TEXT NOT NULL,
DROP COLUMN "exchangeAmount",
ADD COLUMN     "exchangeAmount" MONEY NOT NULL DEFAULT 0,
DROP COLUMN "refundAmount",
ADD COLUMN     "refundAmount" MONEY NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Purchase" DROP COLUMN "branchId",
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."PurchaseReturn" DROP COLUMN "branchId",
ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Sale" DROP COLUMN "branchId",
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."SaleReturn" DROP COLUMN "branchId",
ADD COLUMN     "locationId" TEXT NOT NULL,
DROP COLUMN "totalAmount",
ADD COLUMN     "totalAmount" MONEY NOT NULL,
DROP COLUMN "refundAmount",
ADD COLUMN     "refundAmount" MONEY NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."SaleReturnItem" DROP COLUMN "sellingPrice",
ADD COLUMN     "sellingPrice" MONEY NOT NULL,
DROP COLUMN "totalPrice",
ADD COLUMN     "totalPrice" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "public"."Stock" DROP COLUMN "warehouseId",
ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."StockAdjustment" DROP COLUMN "warehouseId",
ADD COLUMN     "locationId" TEXT NOT NULL,
ADD COLUMN     "reason" "public"."AdjustmentReason" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Transfer" DROP COLUMN "destWarehouseId",
DROP COLUMN "sourceWarehouseId",
ADD COLUMN     "destLocationId" TEXT NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "sourceLocationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "branchId",
ADD COLUMN     "locationId" TEXT;

-- DropTable
DROP TABLE "public"."Branch";

-- DropTable
DROP TABLE "public"."Warehouse";

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "public"."LocationType" NOT NULL,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_code_key" ON "public"."Location"("code");

-- CreateIndex
CREATE INDEX "Location_type_idx" ON "public"."Location"("type");

-- CreateIndex
CREATE INDEX "Location_deletedAt_idx" ON "public"."Location"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "public"."Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "public"."Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_productVariantId_locationId_key" ON "public"."Stock"("productVariantId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_phone_key" ON "public"."Supplier"("phone");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Location" ADD CONSTRAINT "Location_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductExchange" ADD CONSTRAINT "ProductExchange_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Stock" ADD CONSTRAINT "Stock_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockAdjustment" ADD CONSTRAINT "StockAdjustment_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PurchaseReturn" ADD CONSTRAINT "PurchaseReturn_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sale" ADD CONSTRAINT "Sale_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleReturn" ADD CONSTRAINT "SaleReturn_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transfer" ADD CONSTRAINT "Transfer_sourceLocationId_fkey" FOREIGN KEY ("sourceLocationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transfer" ADD CONSTRAINT "Transfer_destLocationId_fkey" FOREIGN KEY ("destLocationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
