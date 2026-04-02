import { z } from "zod";

export const fetchOpenSurveysQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
});
