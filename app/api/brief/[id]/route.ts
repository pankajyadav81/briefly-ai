import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const client = await clientPromise;

    const db = client.db("briefly");

    const brief = await db.collection("history").findOne({
      _id: new ObjectId(id),
    });

    if (!brief) {
      return NextResponse.json(
        {
          success: false,
          message: "Brief not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      brief,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch brief",
      },
      {
        status: 500,
      }
    );
  }
}