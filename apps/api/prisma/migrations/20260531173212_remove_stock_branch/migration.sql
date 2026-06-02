/*
  Warnings:

  - You are about to drop the column `branchId` on the `Stock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productVariantId,warehouseId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Stock" DROP CONSTRAINT "Stock_branchId_fkey";

-- DropIndex
DROP INDEX "public"."Stock_productVariantId_branchId_warehouseId_key";

-- AlterTable
ALTER TABLE "public"."Stock" DROP COLUMN "branchId";

-- CreateIndex
CREATE UNIQUE INDEX "Stock_productVariantId_warehouseId_key" ON "public"."Stock"("productVariantId", "warehouseId");
