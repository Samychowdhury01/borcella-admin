import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { generateFAQs } from "@/lib/generateFAQ";

export async function POST(req: Request) {
  try {
    // Authenticate user
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({
        statusCode: 401,
        success: false,
        message: "Unauthorized",
        data: [],
      });
    }

    // Parse request body
    const product = await req.json();
    const {
      title,
      description,
      media,
      category,
      collectionIds = [],
      tags = [],
      sizes = [],
      colors = [],
      price,
      expense,
    } = product;

    // Input validation (Ensure required fields are present)
    if (!title || !description || !price || !expense) {
      return NextResponse.json({
        statusCode: 400,
        success: false,
        message: "Missing required fields",
        data: [],
      });
    }

    // Check if product already exists
    const isProductExist = await prisma.product.findUnique({
      where: { title },
    });

    if (isProductExist) {
      return NextResponse.json({
        statusCode: 400,
        success: false,
        message: "Product already exists",
        data: [],
      });
    }

    // Create the new product
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        media,
        category,
        collectionIds,
        tags,
        sizes,
        colors,
        price,
        expense,
      },
    });

    // Update linked collections to add the new product ID
    await Promise.all(
      collectionIds.map((collectionId: string) =>
        prisma.collection.update({
          where: { id: collectionId },
          data: {
            productIds: { push: newProduct.id },
          },
        })
      )
    );

    // generate faq
    const faqs = await generateFAQs(newProduct);
    
    // Create product with FAQs
    const createdFaqs = await prisma.fAQs.create({
      data: {
        productId: newProduct.id,
        faqs: {
          create: faqs.map((faq: { question: string; answer: string }) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        },
      },
    });
  
    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("[ERROR at product]:", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}

export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!products) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "No products found!",
        data: [],
      });
    }
    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.log("[ERROR: at products GET method]", error);
  }
}
