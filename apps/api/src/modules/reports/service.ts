import { prisma } from "@/core/database/prisma";
import Papa from "papaparse";

export class ReportService {
  async salesReport(params: {
    startDate?: string;
    endDate?: string;
    branchId?: string;
  }) {
    const where: any = {};
    if (params.branchId) where.branchId = params.branchId;
    if (params.startDate) where.createdAt = { gte: new Date(params.startDate) };
    if (params.endDate)
      where.createdAt = { ...where.createdAt, lte: new Date(params.endDate) };
    return prisma.sale.findMany({
      where,
      include: { items: true, branch: true, customer: true },
    });
  }

  async purchaseReport(params: any) {
    const where: any = {};
    if (params.branchId) where.branchId = params.branchId;
    if (params.startDate) where.createdAt = { gte: new Date(params.startDate) };
    if (params.endDate)
      where.createdAt = { ...where.createdAt, lte: new Date(params.endDate) };
    return prisma.purchase.findMany({
      where,
      include: { items: true, supplier: true, branch: true },
    });
  }

  async inventoryReport(branchId?: string) {
    return prisma.stock.findMany({
      where: { branchId, quantity: { gt: 0 } },
      include: { variant: { include: { product: true } }, location: true },
    });
  }
  async profitLoss(params: any) {
    const start = params.startDate
      ? new Date(params.startDate)
      : new Date("1970-01-01");
    const end = params.endDate ? new Date(params.endDate) : new Date();
    const [sales, purchases, expenses] = await Promise.all([
      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: { createdAt: { gte: start, lte: end } },
      }),
      prisma.purchase.aggregate({
        _sum: { totalAmount: true },
        where: { createdAt: { gte: start, lte: end } },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: start, lte: end } },
      }),
    ]);
    return {
      revenue: sales._sum.totalAmount || 0,
      cost: purchases._sum.totalAmount || 0,
      expenses: expenses._sum.amount || 0,
      profit:
        (sales._sum.totalAmount || 0) -
        (purchases._sum.totalAmount || 0) -
        (expenses._sum.amount || 0),
    };
  }

  async exportProducts(req, reply) {
    const products = await prisma.product.findMany({
      include: productInclude,
    });

    const csv = Papa.unparse(
      products.map((p) => ({
        name: p.name,
        category: p.category?.name,
        sku: p.variants?.[0]?.sku,
        price: p.variants?.[0]?.sellingPrice,
      })),
    );

    reply
      .header("Content-Type", "text/csv")
      .header("Content-Disposition", "attachment; filename=products.csv")
      .send(csv);
  }
}
