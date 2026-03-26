import { env } from "@/env/index.ts";
import fastify from "fastify";
import { usersRoutes } from "./http/routes/users-routes.ts";

export const app = fastify();

app.register(usersRoutes);

app.listen({
  port: env.PORT,
});
