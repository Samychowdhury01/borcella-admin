import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params;
    const orders = await prisma.order.findMany({
      where: {
        customerClerkId: customerId,
      },
      include: {
        customer: true,
        products: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!orders) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "No orders found!",
        data: [],
      });
    }
    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.log("[ERROR: at orders GET method]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal server error",
      data: [],
    });
  }
}
