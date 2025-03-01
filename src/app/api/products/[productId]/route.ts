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

// Update collection
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { userId } = await auth();
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
