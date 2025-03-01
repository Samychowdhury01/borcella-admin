import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const product = await req.json();

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
        title: product.title,
      },
    });

    if (isProductExist) {
      return NextResponse.json({
        statusCode: 400,
        success: false,
        message: "product already exists",
        data: [],
      });
    }
    const newProduct = await prisma.product.create({
      data: {
        ...product,
      },
    });
    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.log("[ERROR at product]:", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
