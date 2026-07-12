import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// ================= GET =================

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db("briefly");

    const history = await db
      .collection("history")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch history",
      },
      {
        status: 500,
      }
    );
  }
}

// ================= DELETE =================

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;

    const db = client.db("briefly");

    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    // Delete ALL History
    if (!id) {
      await db.collection("history").deleteMany({});

      return NextResponse.json({
        success: true,
        message: "All history deleted",
      });
    }

    // Delete One History
    await db.collection("history").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({
      success: true,
      message: "History deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}