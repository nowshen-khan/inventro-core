/*
  Warnings:

  - The values [TRANSFER] on the enum `MovementType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."MovementType_new" AS ENUM ('PURCHASE', 'SALE', 'TRANSFER_IN', 'TRANSFER_OUT', 'RETURN', 'DAMAGE', 'ADJUSTMENT');
ALTER TABLE "public"."StockMovement" ALTER COLUMN "type" TYPE "public"."MovementType_new" USING ("type"::text::"public"."MovementType_new");
ALTER TYPE "public"."MovementType" RENAME TO "MovementType_old";
ALTER TYPE "public"."MovementType_new" RENAME TO "MovementType";
DROP TYPE "public"."MovementType_old";
COMMIT;
