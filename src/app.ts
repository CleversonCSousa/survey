import { env } from "@/env/index.ts";
import fastify from "fastify";
import { usersRoutes } from "./http/routes/users-routes.ts";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { surveysRoutes } from "./http/routes/surveys-routes.ts";
import { errorHandler } from "./http/errors/error-handler.ts";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export const app = fastify();

// Setup swagger with zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: { title: "Survey API", version: "1.0.0" },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.setErrorHandler(errorHandler);
app.register(fastifyCookie);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(usersRoutes);
app.register(surveysRoutes, {
  prefix: "surveys",
});
