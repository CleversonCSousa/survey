import { z } from "zod";
import { authenticate } from "../controllers/authenticate.ts";
import { FastifyInstance } from "fastify";
import { registerBodySchema } from "../schemas/register-schema.ts";
import { authenticateBodySchema } from "../schemas/authenticate-schema.ts";
import { register } from "../controllers/register.ts";

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Registrar novo Usuário",
        description:
          "Cria uma nova conta de usuário no sistema com a role RESPONDENT.",
        body: registerBodySchema,
        response: {
          201: z.null().describe("Usuário criado com sucesso"),
          409: z
            .object({ message: z.string() })
            .describe("Conflito: E-mail já cadastrado"),
          500: z.null().describe("Erro interno no servidor"),
        },
      },
    },
    register,
  );

  app.post(
    "/auth",
    {
      schema: {
        tags: ["Auth"],
        summary: "Autenticar um Usuário",
        description:
          "Autentica o usuário e retorna um Token JWT para acesso e define um Refresh Token via Cookie.",
        body: authenticateBodySchema,
        response: {
          200: z
            .object({
              token: z.string(),
            })
            .describe("Autenticado com sucesso. Token JWT retornado."),
          400: z
            .object({
              message: z.string(),
            })
            .describe("Credenciais inválidas (E-mail ou senha incorretos)"),
          500: z.null().describe("Erro interno no servidor"),
        },
      },
    },
    authenticate,
  );
}
