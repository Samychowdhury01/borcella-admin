"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getProducts = async () => {
  const { userId } = await auth();

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
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  // Get single collection by id
  const collection = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!collection) {
    return null;
  }
  return collection;
};
