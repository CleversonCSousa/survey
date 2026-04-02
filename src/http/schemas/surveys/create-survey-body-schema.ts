import { z } from "zod";

export const createSurveyBodySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  questions: z.array(
    z.object({
      text: z.string(),
      options: z.array(z.string().min(1)),
    }),
  ),
  status: z.enum(["DRAFT", "OPEN", "CLOSED"]).optional().default("DRAFT"),
});
