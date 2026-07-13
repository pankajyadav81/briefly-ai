import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db("briefly");

    const users = db.collection("users");

    const existingUser = await users.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
        await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    });

  } catch (error: any) {
  console.error("SIGNUP ERROR:", error);

  return NextResponse.json(
    {
      success: false,
      message: error?.message || "Internal Server Error",
    },
    {
      status: 500,
    }
  );
}
}