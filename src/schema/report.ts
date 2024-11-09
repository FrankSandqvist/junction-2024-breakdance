import { z } from "zod";

export const reportSchema = z.object({
  object: z.string().nullable(),
  objectCategory: z.string().nullable(),
  manufacturerIsRelevant: z.boolean().nullable(),
  manufacturer: z.string().nullable(),
  modelIsRelevant: z.boolean().nullable(),
  model: z.string().nullable(),
  damage: z.string().nullable(),
  condition: z.string().nullable(),
  serialNumberOrIdentifierIsRelevant: z.boolean().nullable(),
  serialNumberOrIdentifier: z.string().nullable(),
});
