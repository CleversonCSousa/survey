import { z } from "zod";

export const fetchCoordinatorSurveysQuerySchema = z.object({
  page: z.coerce.number().min(1).max(1000).default(1),
});
