// import { openrouter } from "@/config/openrouter";
// import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/prompt";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest) {
//     const { userInput, deviceType, projectId } = await req.json();

//     // The SDK's 'send' method requires an object with a 'messages' array.
//     const stream = await openrouter.chat.send({
//         model: "nousresearch/hermes-3-llama-3.1-405b:free",
//         messages: [
//             {
//                 role: 'system',
//                 content: [
//                     {
//                         type: 'text',
//                         text: APP_LAYOUT_CONFIG_PROMPT
//                     }
//                 ]
//             },
//             {
//                 role: "user",
//                 // Corrected: Content objects must be inside curly braces within the array.
//                 content: [
//                     {
//                         type: "text",
//                         text: userInput
//                     }
//                 ]
//             }
//         ],
//         // stream: true // Enables Server-Sent Events (SSE)
//     });

//     // To use this in a Next.js Route Handler, you must iterate over the stream 
//     // and return a Response. 
// }




import { NextRequest, NextResponse } from "next/server";
import { openrouter } from "@/config/openrouter";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/prompt";
import { db } from "@/config/db";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { userInput,deviceType, projectId } = await req.json();

  const aiResult = await openrouter.chat.send({
    chatGenerationParams: {
    //   
    model: "mistralai/mixtral-8x7b-instruct",
      messages: [
        {
          role: "system",
          content: APP_LAYOUT_CONFIG_PROMPT.replace('{deviceType}', deviceType),
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      stream: false,
    },
  });

  const JSONAiResult = JSON.parse(aiResult?.choices[0]?.message?.content)
  console.log(aiResult)

  if(JSONAiResult) {
    // update project table with visualdescription 
  await db.update(ProjectTable).set({
    projectVisualDescription: JSONAiResult.projectVisualDescription,
    projectName:JSONAiResult.projectName,
    theme:JSONAiResult?.theme
  }).where(eq(ProjectTable.projectId, projectId as string))
  // insert screen config in db
  JSONAiResult.screens?.forEach(async (screen:any) => {
     const result = await db.insert(ScreenConfigTable).values({
        projectId:projectId,
        purpose: screen?.purpose,
        screenDescription: screen?.layoutDescription,
        screenId:screen?.id,
        screenName:screen?.name
     })
  })
  return NextResponse.json(JSONAiResult)
  }
  else {
    return NextResponse.json({msg: "error"})
  }
}