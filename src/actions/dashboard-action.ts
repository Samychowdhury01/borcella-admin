import { auth } from "@/auth";
import prisma from "@/lib/prisma";


export const getTotalSales = async () => {
    const session = await auth();
      const userId = session?.user?.id;

  if (!userId) {
    return {};
  }
  const orders = await prisma.order.findMany({});
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (acc: number, order: any) => acc + order.totalAmount,
    0
  );
  return {
    totalOrders,
    totalRevenue,
  };
};

export const getTotalCustomers = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return 0;
  }
  const totalCustomers = await prisma.customer.count();

  return totalCustomers;
};

export const getSalesPerMonth = async () => {
  const orders = await prisma.order.findMany({});
  const salesPerMonth = orders.reduce((acc: any, order: any) => {
    const monthIndex = new Date(order.createdAt).getMonth();
    acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
    return acc;
  }, {});

  const graphData = Array.from({ length: 12 }, (_, i) => {
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      new Date(0, i)
    );
    return { name: month, sales: salesPerMonth[i] || 0 };
  });
  return graphData;
};
