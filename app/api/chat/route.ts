import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {

    const { summary, question } = await req.json();

    if (!summary || !question) {

      return NextResponse.json(
        {
          success: false,
          message: "Summary and Question are required.",
        },
        {
          status: 400,
        }
      );

    }

    const response = await ai.models.generateContent({

      model: "gemini-2.5-flash",

      contents: `
You are an AI Study Assistant.

Use ONLY the summary below to answer.

If the answer is not available in the summary,
say:

"I couldn't find that information in the summary."

--------------------------------------

SUMMARY

${summary}

--------------------------------------

QUESTION

${question}

--------------------------------------

ANSWER:
      `,
    });
        return NextResponse.json({
      success: true,
      answer: response.text,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate answer.",
      },
      {
        status: 500,
      }
    );
  }
}