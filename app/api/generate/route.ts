import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          message: "Prompt is required",
        },
        {
          status: 400,
        }
      );
    }

    console.log("🚀 Prompt:", prompt);
    console.log("🔑 API Key Loaded:", !!process.env.GEMINI_API_KEY);

    // Gemini Response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const summary = response.text;

    console.log("✅ Summary Generated");

    // ===== MongoDB Save =====
    try {
      const client = await clientPromise;
      console.log("✅ Mongo Connected");

      const db = client.db("briefly");

      const result = await db.collection("history").insertOne({
        title: prompt.substring(0, 50),
        summary,
        createdAt: new Date(),
      });

      console.log("✅ Saved to MongoDB:", result.insertedId);
    } catch (mongoError) {
      console.error("❌ MongoDB Error:");
      console.error(mongoError);
    }

    return NextResponse.json({
      success: true,
      summary,
    });

  } catch (error: any) {
    console.error("❌ Gemini Error:");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to generate summary",
      },
      {
        status: 500,
      }
    );
  }
}