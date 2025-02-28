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

export const getSingleCollection = async (collectionId: string) => {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  // Get single collection by id
  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
    },
  });
  if (!collection) {
    return null;
  }
  return collection;
};
