"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";



export const getAllCustomers = async () => {
  const session = await auth();
    const userId = session?.user?.id;

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
