-- CreateTable
CREATE TABLE "public"."ProductExchange" (
    "id" TEXT NOT NULL,
    "exchangeNo" TEXT NOT NULL,
    "originalSaleId" TEXT NOT NULL,
    "saleReturnId" TEXT NOT NULL,
    "newSaleId" TEXT NOT NULL,
    "customerId" TEXT,
    "branchId" TEXT NOT NULL,
    "exchangeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "refundAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductExchange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductExchange_exchangeNo_key" ON "public"."ProductExchange"("exchangeNo");

-- AddForeignKey
ALTER TABLE "public"."ProductExchange" ADD CONSTRAINT "ProductExchange_originalSaleId_fkey" FOREIGN KEY ("originalSaleId") REFERENCES "public"."Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductExchange" ADD CONSTRAINT "ProductExchange_saleReturnId_fkey" FOREIGN KEY ("saleReturnId") REFERENCES "public"."SaleReturn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductExchange" ADD CONSTRAINT "ProductExchange_newSaleId_fkey" FOREIGN KEY ("newSaleId") REFERENCES "public"."Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductExchange" ADD CONSTRAINT "ProductExchange_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductExchange" ADD CONSTRAINT "ProductExchange_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
