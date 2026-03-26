import { FastifyInstance } from "fastify";
import { register } from "@/http/controllers/register.ts";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/register", register);
}
