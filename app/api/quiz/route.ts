import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { summary } = await req.json();

    if (!summary) {
      return NextResponse.json(
        {
          success: false,
          message: "Summary is required",
        },
        { status: 400 }
      );
    }

    const prompt = `
Generate exactly 10 multiple choice questions from the following summary.

Rules:
- Return ONLY valid JSON.
- Do not write markdown.
- Do not write \`\`\`.
- Each question must have 4 options.
- Only one correct answer.

Format:

[
 {
   "question":"...",
   "options":[
      "...",
      "...",
      "...",
      "..."
   ],
   "answer":"..."
 }
]

Summary:

${summary}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text ?? "";

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const quiz = JSON.parse(text);

    return NextResponse.json({
      success: true,
      quiz,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}