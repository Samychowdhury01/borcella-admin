import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const { collectionId } = await params;
    const product = await prisma.product.findMany({
      where: {
        collectionIds: {
          has: collectionId,
        },
      },
    });
    if (!product) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "No product found!",
        data: [],
      });
    }
    return NextResponse.json(
      {
        statusCode: 201,
        success: true,
        message: "Products retrieved successfully",
        data: product,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.log("[ERROR: at [productId] GET method]", error);
  }
}
