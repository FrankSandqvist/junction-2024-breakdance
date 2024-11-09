import { reportSchema } from "@/schema/report";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const POST = async (req: Request) => {
  const params = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  console.log([
    {
      role: "system",
      content: `Your job is to gather relevant information about equipment being photographed.
Specifically, what it is and its condition. Do not return the field, if the information is not available.
For special cases where it is equipment that usually does not have a serial number, clear manufacturer or model, you can say it is irrelevant. And it will be removed from the user's UI.
Do not include fields for things that cannot be gathered from the image.
You can also provide a very short witty comment (for example, if's a fire extinguisher "That's fire! 🔥").
You can also return a suggestion for more photos to be able to provide a more complete analysis (missing fields).
When you are happy with the info gathered (all relevant fields filled), return no suggestion.

IMPORTANT:
ALL PICTURES ARE TO BE DIFFERENT ANGLES OF THE SAME THING, SO DON'T MAKE ASSUMPTIONS PURELY FROM THE ANGLE YOU CURRENTLY PROVIDED.
DO NOT MAKE ASSUMPTIONS ABOUT ANY PARAMETER. IF IT IS NOT CLEAR, DO NOT ADD THE FIELD.
NEVER REMOVE INFORMATION, ONLY ADD OR IMPROVE.`,
    },
    {
      role: "user",
      content: "We are analyzing object X.",
    },

    ...params.previousReports.flatMap((r: z.infer<typeof reportSchema>) => [
      {
        role: "user",
        content: "Here is another photo of object X.",
      },
      {
        role: "assistant",
        content: JSON.stringify(r),
      },
    ]),
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
      ],
    },
  ]);
  const aiRes = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Your job is to gather relevant information about equipment being photographed.
Specifically, what it is and its condition. Do not return the field, if the information is not available.
For special cases where it is equipment that usually does not have a serial number, clear manufacturer or model, you can say it is irrelevant. And it will be removed from the user's UI.
Do not include fields for things that cannot be gathered from the image.
You can also provide a very short witty comment (for example, if's a fire extinguisher "That's fire! 🔥").
You can also return a suggestion for more photos to be able to provide a more complete analysis (missing fields).
When you are happy with the info gathered (all relevant fields filled), return no suggestion.

IMPORTANT:
ALL PICTURES ARE TO BE DIFFERENT ANGLES OF THE SAME THING, SO DON'T MAKE ASSUMPTIONS PURELY FROM THE ANGLE YOU CURRENTLY PROVIDED.
DO NOT MAKE ASSUMPTIONS ABOUT ANY PARAMETER. IF IT IS NOT CLEAR, DO NOT ADD THE FIELD.
NEVER REMOVE INFORMATION, ONLY ADD OR IMPROVE.`,
      },
      {
        role: "user",
        content: "We are analyzing object X.",
      },
      ...params.previousReports.flatMap((r: z.infer<typeof reportSchema>) => [
        {
          role: "user",
          content: "Here is another photo of object X.",
        },
        {
          role: "assistant",
          content: JSON.stringify(r),
        },
      ]),
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
        ],
      },
    ],
    response_format: zodResponseFormat(
      reportSchema
        .omit({
          latitude: true,
          longitude: true,
        })
        .extend({
          wittyComment: z.string().nullable(),
          suggestionForMorePhotos: z.string().nullable(),
        }),
      "report"
    ),
  });

  const response = JSON.parse(aiRes.choices[0].message.content!);

  for (const key in response) {
    if (
      response[key] === null ||
      response[key] === "" ||
      response[key] === "N/A" ||
      response[key] === "n/a" ||
      response[key] === "unknown" ||
      response[key] === "Unknown"
    ) {
      delete response[key];
    }
  }

  console.log(response);

  return Response.json(response);
};
