import { z } from "zod";

export const createSurveyBodySchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  questions: z
    .array(
      z.object({
        text: z.string().min(1).max(255),
        options: z.array(z.string().min(1).max(100)).min(1).max(5),
      }),
    )
    .min(1)
    .max(10),
  status: z.enum(["DRAFT", "OPEN", "CLOSED"]).optional().default("DRAFT"),
});
