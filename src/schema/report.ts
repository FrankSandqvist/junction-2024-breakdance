import { z } from "zod";

export const reportSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  object: z.string().optional(),
  objectCategory: z.string().optional(),
  manufacturerIsRelevant: z.boolean().optional(),
  manufacturer: z.string().optional(),
  modelIsRelevant: z.boolean().optional(),
  model: z.string().optional(),
  damage: z.string().optional(),
  condition: z.string().optional(),
  serialNumberOrIdentifierIsRelevant: z.boolean().optional(),
  serialNumberOrIdentifier: z.string().optional(),
});
