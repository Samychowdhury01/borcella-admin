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

    if (!product) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "No  product found!",
        data: [],
      });
    }

    const faqs = await prisma.fAQs.findMany({
      where: {
        productId,
      },
      include:{
        faqs: true
      }
    });

    if (!faqs) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "No FAQs available for this products!",
        data: [],
      });
    }
    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "FAQs retrieved successfully",
      data: faqs,
    });
  } catch (error) {
    console.log("[ERROR: at related FAQs GET method]", error);
  }
}
