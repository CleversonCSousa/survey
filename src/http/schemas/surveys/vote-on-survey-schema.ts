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
    .min(1)
    .max(10)
    .refine(
      (items) => {
        const questionIds = items.map((item) => item.questionId);
        return new Set(questionIds).size === questionIds.length;
      },
      {
        message: "Each question can only be answered once.",
      },
    ),
});
