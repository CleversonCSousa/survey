import { z } from "zod";

export const getResultsParamsSchema = z.object({
  surveyId: z.uuid(),
});
