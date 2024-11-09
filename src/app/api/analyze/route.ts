import { reportSchema } from "@/schema/report";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const POST = async (req: Request) => {
  const params = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const aiRes = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          `Your job is to gather relevant information about equipment being photographed.
Specifically, what it is and its condition. You can return null if the information is not available.
For things that are not relevant for specific thing visible, return false.
Return null for everything if nothing can be gathered.
You can also provide a short compliment (for example, if's a fire extinguisher "That's fire! 🔥") and a suggestion for more photos. 
When you are happy with the info gathered, return no suggestion (null).
DO NOT MAKE ASSUMPTIONS ABOUT ANY PARAMETER. IF IT IS NOT CLEAR, RETURN null.`,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              detail: "high",
              url: `${params.image}`,
            },
          },
          /*{
            type: "text",
            text: "What is in this image?",
          },*/
        ],
      },
    ],
    response_format: zodResponseFormat(
      reportSchema.extend({
        shortCompliment: z.string().nullable(),
        suggestionForMorePhotos: z.string().nullable(),
      }),
      "report"
    ),
  });

  const response = JSON.parse(aiRes.choices[0].message.content!);

  return Response.json(response);
};
