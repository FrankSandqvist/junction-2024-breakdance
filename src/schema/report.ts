import { z } from "zod";

export const reportSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  object: z.string().optional(),
  objectCategory: z.string().optional(),
  manufacturerIsIrrelevant: z.boolean().optional(),
  manufacturer: z.string().optional(),
  modelIsIrrelevant: z.boolean().optional(),
  model: z.string().optional(),
  conditionOrDamage: z.string().optional(),
  serialNumberOrIdentifierIsIrrelevant: z.boolean().optional(),
  serialNumberOrIdentifier: z.string().optional(),
});
