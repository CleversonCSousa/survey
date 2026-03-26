import { env } from "@/env/index.ts";
import fastify from "fastify";
import { usersRoutes } from "./http/routes/users-routes.ts";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { surveysRoutes } from "./http/routes/surveys-routes.ts";

export const app = fastify();

app.register(fastifyCookie);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(usersRoutes);
app.register(surveysRoutes, {
  prefix: "surveys",
});
