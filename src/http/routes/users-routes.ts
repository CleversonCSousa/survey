import { FastifyInstance } from "fastify";
import { register } from "@/http/controllers/register.ts";
import { authenticate } from "../controllers/authenticate.ts";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/auth", authenticate);
}
