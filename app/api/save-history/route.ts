import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { title, summary } = await req.json();

    if (!title || !summary) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and Summary are required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db("briefly");

    const history = db.collection("history");

    await history.insertOne({
      title,
      summary,
      createdAt: new Date(),
    });
        return NextResponse.json({
      success: true,
      message: "History saved successfully",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save history",
      },
      {
        status: 500,
      }
    );
  }
}