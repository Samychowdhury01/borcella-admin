"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const getCollections = async () => {
  const session = await auth();
  const userId = session?.user?.id;

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
  const session = await auth();
  const userId = session?.user?.id;
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
