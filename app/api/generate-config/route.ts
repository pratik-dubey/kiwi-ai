import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/prompt";
import { db } from "@/config/db";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { eq } from "drizzle-orm";

const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function POST(req: NextRequest) {
  const { userInput, deviceType, projectId } = await req.json();

  const completion = await nvidia.chat.completions.create({
    model: "mistralai/mamba-codestral-7b-v0.1",
    messages: [
      {
        role: "system",
        content: APP_LAYOUT_CONFIG_PROMPT.replace("{deviceType}", deviceType),
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

  const rawContent = completion.choices[0]?.message?.content;

  let JSONAiResult;
  try {
    // Strip markdown code fences if present
    const cleaned = rawContent?.replace(/```json|```/g, "").trim();
    JSONAiResult = JSON.parse(cleaned ?? "");
  } catch (e) {
    console.error("Failed to parse AI response:", rawContent);
    return NextResponse.json({ msg: "Failed to parse AI response" });
  }

  console.log(JSONAiResult);

  if (JSONAiResult) {
    // Update project table with visual description
    await db
      .update(ProjectTable)
      .set({
        projectVisualDescription: JSONAiResult.projectVisualDescription,
        projectName: JSONAiResult.projectName,
        theme: JSONAiResult?.theme,
      })
      .where(eq(ProjectTable.projectId, projectId as string));

    // Insert screen config in db
    JSONAiResult.screens?.forEach(async (screen: any) => {
      await db.insert(ScreenConfigTable).values({
        projectId: projectId,
        purpose: screen?.purpose,
        screenDescription: screen?.layoutDescription,
        screenId: screen?.id,
        screenName: screen?.name,
      });
    });

    return NextResponse.json(JSONAiResult);
  } else {
    return NextResponse.json({ msg: "error" });
  }
}



// import { NextRequest, NextResponse } from "next/server";
// import { openrouter } from "@/config/openrouter";
// import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/prompt";
// import { db } from "@/config/db";
// import { ProjectTable, ScreenConfigTable } from "@/config/schema";
// import { eq } from "drizzle-orm";

// export async function POST(req: NextRequest) {
//   const { userInput,deviceType, projectId } = await req.json();

//   const aiResult = await openrouter.chat.send({
//     chatGenerationParams: {
//     //   
//     model: "meta-llama/llama-3.1-8b-instruct:free",
//       messages: [
//         {
//           role: "system",
//           content: APP_LAYOUT_CONFIG_PROMPT.replace('{deviceType}', deviceType),
//         },
//         {
//           role: "user",
//           content: userInput,
//         },
//       ],
//       stream: false,
//     },
//   });

//   const JSONAiResult = JSON.parse(aiResult?.choices[0]?.message?.content)
//   console.log(aiResult)

//   if(JSONAiResult) {
//     // update project table with visualdescription 
//   await db.update(ProjectTable).set({
//     projectVisualDescription: JSONAiResult.projectVisualDescription,
//     projectName:JSONAiResult.projectName,
//     theme:JSONAiResult?.theme
//   }).where(eq(ProjectTable.projectId, projectId as string))
//   // insert screen config in db
//   JSONAiResult.screens?.forEach(async (screen:any) => {
//      const result = await db.insert(ScreenConfigTable).values({
//         projectId:projectId,
//         purpose: screen?.purpose,
//         screenDescription: screen?.layoutDescription,
//         screenId:screen?.id,
//         screenName:screen?.name
//      })
//   })
//   return NextResponse.json(JSONAiResult)
//   }
//   else {
//     return NextResponse.json({msg: "error"})
//   }
// }