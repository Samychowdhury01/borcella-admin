import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// delete product
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        statusCode: 401,
        success: false,
        message: "Unauthorized",
        data: [],
      });
    }
    const isProductExist = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!isProductExist) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "product not found",
        data: [],
      });
    }
    const deleteProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    return NextResponse.json({
      statusCode: 200,
      success: true,
      message: "product deleted successfully",
      data: deleteProduct,
    });
  } catch (error) {
    console.log("[ERROR at DELETE /api/products/:productId]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
