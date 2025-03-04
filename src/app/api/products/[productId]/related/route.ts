import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if(!product){
        return  NextResponse.json({
            statusCode: 404,
            success: false,
            message: "No  product found!",
            data: [],
          });
    }

    const relatedProducts = await prisma.product.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  category: product?.category,
                },
                {
                  collectionIds: {
                    hasSome: product.collectionIds, // Matches if any element overlaps
                  },
                },
              ],
            },
            {
              id: {
                not: product.id, 
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      
    if (!relatedProducts) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "No related products found!",
        data: [],
      });
    }
    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Products retrieved successfully",
      data: relatedProducts,
    });
  } catch (error) {
    console.log("[ERROR: at related products GET method]", error);
  }
}
