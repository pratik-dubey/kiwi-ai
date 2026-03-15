import { db } from "@/config/db";
import { ScreenConfigTable } from "@/config/schema";
import { GENERATION_SCREEN_PROMPT } from "@/data/prompt";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function POST(req: NextRequest) {
  const {
    projectId,
    screenId,
    screenName,
    purpose,
    screenDescription,
    projectVisualDescription,
  } = await req.json();

  const userInput = `
    screen name is ${screenName},
    screen purpose is ${purpose},
    screen description is ${screenDescription}
  `;

  try {
    const completion = await nvidia.chat.completions.create({
      model: "mistralai/mamba-codestral-7b-v0.1",
      messages: [
        {
          role: "system",
          content: GENERATION_SCREEN_PROMPT,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      temperature: 0.5,
      top_p: 1,
      max_tokens: 1024,
      stream: false,
    });

    const code = completion.choices[0]?.message?.content;

    const updateResult = await db
      .update(ScreenConfigTable)
      .set({
        code: code as string,
      })
      .where(
        and(
          eq(ScreenConfigTable.projectId, projectId),
          eq(ScreenConfigTable.screenId, screenId as string)
        )
      )
      .returning();

    return NextResponse.json(updateResult[0]);
  } catch (error) {
    console.error("Screen generation error:", error);
    return NextResponse.json({ msg: "Internal server error!" });
  }
}