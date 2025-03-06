"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";


export const getProducts = async () => {
    const session = await auth();
      const userId = session?.user?.id;

  if (!userId) {
    return [];
  }
  // Get collections for the user
  const collections = await prisma.product.findMany({
    include: {
      collections: true,
    },
  });
  return collections;
};

export const getSingleProduct = async (productId: string) => {
    const session = await auth();
    const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  // Get single collection by id
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    return null;
  }
  return product;
};
