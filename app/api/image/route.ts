import { GoogleGenAI } from "@google/genai";
import next from "next";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "No image uploaded",
        },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();

    const base64 = Buffer.from(bytes).toString("base64");
        const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: image.type,
            data: base64,
          },
        },
        {
          text: `
Analyze this image professionally.

Return:

1. Executive Summary

2. Key Objects

3. Important Details

4. Explanation

5. Conclusion
          `,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      summary: response.text,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to analyze image",
      },
      {
        status: 500,
      }
    );
  }
}