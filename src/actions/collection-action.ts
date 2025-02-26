"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getCollections = async () => {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }
  // Get collections for the user
  const collections = await prisma.collection.findMany({
    include: {
      products: true,
    },
  });
  return collections;
};
