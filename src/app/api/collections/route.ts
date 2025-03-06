import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
      const session = await auth();
        const userId = session?.user?.id;
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

export async function GET(req: Request) {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!collections) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "No collections found!",
        data: [],
      });
    }
    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Collections retrieved successfully",
      data: collections,
    });
  } catch (error) {
    console.log("[ERROR: at collection GET method]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal server error",
      data: [],
    });
  }
}
