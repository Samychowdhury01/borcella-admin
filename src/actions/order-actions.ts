import prisma from "@/lib/prisma";

export const getAllOrders = async () => {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      shippingAddress: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!orders.length) {
    return [];
  }
  return orders;
};

export const getOrderDetails = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      customer: true,
      shippingAddress: true,
      products: {
        include: {
          product: {
            select: {
              id: true,
              title: true
            }
          },
        },
      },
    },
  });

  if (!order) {
    return null;
  }
  return order;
};
