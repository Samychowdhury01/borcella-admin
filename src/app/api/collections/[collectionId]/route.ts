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
