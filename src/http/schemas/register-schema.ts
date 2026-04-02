import { z } from "zod";

export const registerBodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email().max(255),
  password: z.string().min(6).max(72),
});
