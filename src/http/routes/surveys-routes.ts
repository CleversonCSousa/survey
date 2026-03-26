import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/verify-jwt.ts";
import { create } from "../controllers/surveys/create.ts";
import { verifyUserRole } from "../middlewares/verify-user-role.ts";

export async function surveysRoutes(app: FastifyInstance) {
  // Protected routes!
  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook("onRequest", verifyJWT);
    protectedRoutes.addHook("onRequest", verifyUserRole("COORDINATOR"));
    protectedRoutes.post("/", create);
  });
}
