import { z } from "zod";

export const authenticateBodySchema = z.object({
  email: z.email().max(255),
  password: z.string().min(6).max(72),
});
