import { z } from "zod";

export const toggleStatusParamsSchema = z.object({
  id: z.uuid(),
});

export const toggleStatusBodySchema = z.object({
  status: z.enum(["OPEN", "CLOSED", "DRAFT"]),
});
