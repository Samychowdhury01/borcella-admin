import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// delete product
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
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
    const isProductExist = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        faqs: true,
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

    if (isProductExist.faqs) {
      // Delete all FaqPatterns associated with the FAQs
      await prisma.faqPattern.deleteMany({
        where: { faqId: isProductExist.faqs.id },
      });

      // Delete the FAQs entry
      await prisma.fAQs.delete({
        where: { id: isProductExist.faqs.id },
      });
    }
     await prisma.product.delete({
      where: {
        id: isProductExist.id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      success: true,
      message: "product deleted successfully",
      data: [],
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

// Update collection
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const session = await auth();
    const userId = session?.user?.id;
    const updatableValues = await req.json();

    if (!userId) {
      return NextResponse.json({
        statusCode: 401,
        success: false,
        message: "Unauthorized",
        data: [],
      });
    }
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!existingProduct) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "Product not found",
        data: [],
      });
    }
    // check if update data available or not
    if (Object.keys(updatableValues).length === 0) {
      return NextResponse.json({
        statusCode: 400,
        success: false,
        message: "Bad Request",
        data: [],
      });
    }
    // Handle collectionIds update if provided
    if (updatableValues.collectionIds) {
      const { collectionIds } = updatableValues;

      // Get current collections
      const oldCollectionIds = existingProduct.collectionIds || [];

      // Find collections to add and remove
      const collectionsToAdd = collectionIds.filter(
        (id: string) => !oldCollectionIds.includes(id)
      );
      const collectionsToRemove = oldCollectionIds.filter(
        (id: string) => !collectionIds.includes(id)
      );

      // Remove productId from old collections
      await Promise.all(
        collectionsToRemove.map(async (collectionId: string) => {
          const collection = await prisma.collection.findUnique({
            where: { id: collectionId },
          });

          if (!collection) return;

          // Remove the productId from the collection's productIds array
          await prisma.collection.update({
            where: { id: collectionId },
            data: {
              productIds: {
                set: collection.productIds.filter((id) => id !== productId),
              },
            },
          });
        })
      );

      // Add productId to new collections
      await Promise.all(
        collectionsToAdd.map((collectionId: string) =>
          prisma.collection.update({
            where: { id: collectionId },
            data: {
              productIds: { push: productId },
            },
          })
        )
      );
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...updatableValues,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.log("[ERROR at PATCH /api/products/:productId]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}

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
        message: "No product found!",
        data: [],
      });
    }
    return NextResponse.json(
      {
        statusCode: 201,
        success: true,
        message: "Product retrieved successfully",
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
