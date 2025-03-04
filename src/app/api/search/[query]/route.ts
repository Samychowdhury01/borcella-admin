import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ query: string }> }
) {
  try {
    const { query } = await params;

    // Fetch products based on search query using Prisma with MongoDB
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!products.length) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "No products found matching your query!",
        data: [],
      });
    }

    return NextResponse.json({
      statusCode: 200,
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("[ERROR: at SEARCH_QUERY GET method]", error);

    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
