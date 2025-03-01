import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// delete collection
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const { collectionId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        statusCode: 401,
        success: false,
        message: "Unauthorized",
        data: [],
      });
    }
    const isCollectionExist = await prisma.collection.findUnique({
      where: {
        id: collectionId,
      },
    });
    if (!isCollectionExist) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "Collection not found",
        data: [],
      });
    }
    const deleteCollection = await prisma.collection.delete({
      where: {
        id: collectionId,
      },
    });
    return NextResponse.json({
      statusCode: 200,
      success: true,
      message: "Collection deleted successfully",
      data: deleteCollection,
    });
  } catch (error) {
    console.log("[ERROR at DELETE /api/collections/:collectionId]", error);
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
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const { collectionId } = await params;
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
    const isCollectionExist = await prisma.collection.findUnique({
      where: {
        id: collectionId,
      },
    });
    if (!isCollectionExist) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "Collection not found",
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
    // if exist then update the collection
    const UpdatedCollection = await prisma.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        ...updatableValues,
      },
    });
    return NextResponse.json({
      statusCode: 200,
      success: true,
      message: "Collection updated successfully",
      data: UpdatedCollection,
    });
  } catch (error) {
    console.log("[ERROR at PATCH /api/collections/:collectionId]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
