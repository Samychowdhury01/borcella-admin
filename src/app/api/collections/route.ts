import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const collection = await req.json();

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
        title: collection.title,
      },
    });

    if (isCollectionExist) {
      return NextResponse.json({
        statusCode: 400,
        success: false,
        message: "Collection already exists",
        data: [],
      });
    }
    const newCollection = await prisma.collection.create({
      data: {
        ...collection,
      },
    });
    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Collection created successfully",
      data: newCollection,
    });
  } catch (error) {
    console.log("[ERROR at Collection]:", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
