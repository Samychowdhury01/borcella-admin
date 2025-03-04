"use server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


export const getAllCustomers = async () => {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }
  // Get customers for the user
  const customers = await prisma.customer.findMany({
    orderBy: {
        createdAt: "desc"
    }
  });

  if(!customers.length){
    return []
  }
  return customers;
};
