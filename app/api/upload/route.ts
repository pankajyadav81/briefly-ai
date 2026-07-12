import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No PDF uploaded",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    const base64 = Buffer.from(bytes).toString("base64");
        const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64,
          },
        },
        {
          text: `
Summarize this PDF in a professional way.

Return:

1. Executive Summary

2. Key Points

3. Important Concepts

4. Conclusion
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
        message: "Failed to summarize PDF",
      },
      { status: 500 }
    );
  }
}