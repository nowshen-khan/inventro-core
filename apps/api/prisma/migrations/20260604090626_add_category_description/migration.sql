-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "description" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
