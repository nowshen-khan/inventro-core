import { prisma } from "@/core/database/prisma";

export class DashboardService {
  async getStats() {
    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todaySales,

      monthlySales,

      todayPurchases,

      totalProducts,

      totalCustomers,

      lowStock,

      recentSales,
    ] = await Promise.all([
      prisma.sale.aggregate({
        _sum: {
          totalAmount: true,
        },

        where: {
          createdAt: {
            gte: startOfDay,
          },
        },
      }),

      prisma.sale.aggregate({
        _sum: {
          totalAmount: true,
        },

        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),

      prisma.purchase.aggregate({
        _sum: {
          totalAmount: true,
        },

        where: {
          createdAt: {
            gte: startOfDay,
          },
        },
      }),

      prisma.product.count(),

      prisma.customer.count(),

      prisma.stock.findMany({
        where: {
          quantity: {
            lte: 5,
          },
        },

        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },

        take: 10,
      }),

      prisma.sale.findMany({
        include: {
          customer: true,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 10,
      }),
    ]);

    return {
      todaySales: todaySales._sum.totalAmount || 0,

      monthlySales: monthlySales._sum.totalAmount || 0,

      todayPurchases: todayPurchases._sum.totalAmount || 0,

      totalProducts,

      totalCustomers,

      lowStock,

      recentSales,
    };
  }

  async getSalesTrend() {
    const sales = await prisma.sale.findMany({
      select: {
        totalAmount: true,

        createdAt: true,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    const grouped = sales.reduce((acc: any, sale) => {
      const date = new Date(sale.createdAt).toLocaleDateString();

      if (!acc[date]) {
        acc[date] = 0;
      }

      acc[date] += Number(sale.totalAmount);

      return acc;
    }, {});

    return Object.entries(grouped).map(([name, sales]) => ({
      name,

      sales,
    }));
  }
}
