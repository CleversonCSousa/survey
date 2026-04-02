import { z } from "zod";

export const voteOnSurveyParamsSchema = z.object({
  surveyId: z.uuid(),
});

export const voteOnSurveyBodySchema = z.object({
  responses: z
    .array(
      z.object({
        questionId: z.uuid(),
        optionId: z.uuid(),
      }),
    )
    .min(1),
});
