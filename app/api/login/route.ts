import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and Password are required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("briefly");
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Password",
        },
        { status: 401 }
      );
    }
        return NextResponse.json({
      success: true,
      message: "Login Successful",
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}