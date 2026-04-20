import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/verify-jwt.ts";
import { create } from "../controllers/surveys/create.ts";
import { verifyUserRole } from "../middlewares/verify-user-role.ts";
import { fetchCoordinatorSurveys } from "../controllers/surveys/fetch-coordinator-surveys.ts";
import { toggleStatus } from "../controllers/surveys/toggle-status.ts";
import { fetchOpenSurveys } from "../controllers/surveys/fetch-open-surveys.ts";
import { voteOnSurvey } from "../controllers/surveys/vote-on-survey.ts";
import { getResults } from "../controllers/surveys/get-results.ts";
import { createSurveyBodySchema } from "../schemas/surveys/create-survey-body-schema.ts";
import { z } from "zod";
import { fetchCoordinatorSurveysQuerySchema } from "../schemas/surveys/fetch-coordinator-surveys-schema.ts";
import { fetchOpenSurveysQuerySchema } from "../schemas/surveys/fetch-open-surveys-schema.ts";

export async function surveysRoutes(app: FastifyInstance) {
  // Protected routes!
  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook("onRequest", verifyJWT);
    protectedRoutes.addHook("onRequest", verifyUserRole("COORDINATOR"));
    protectedRoutes.post(
      "/",
      {
        schema: {
          tags: ["Surveys"],
          summary: "Criar uma nova pesquisa",
          description:
            "Cria uma nova pesquisa no sistema associada ao coordenador autenticado.",
          body: createSurveyBodySchema,
          security: [{ bearerAuth: [] }],
          response: {
            201: z.null().describe("Pesquisa criada com sucesso"),
            400: z
              .object({
                message: z.string(),
                issues: z.any().optional(),
              })
              .describe("Erro de validação de dados ou estrutura"),
            401: z
              .object({
                message: z.string(),
              })
              .describe("Token JWT ausente ou inválido"),
            403: z
              .object({
                message: z.string(),
              })
              .describe("Usuário sem permissão de Coordenador"),
            404: z
              .object({
                message: z.string(),
              })
              .describe("Recurso não encontrado"),
            409: z
              .object({
                message: z.string(),
              })
              .describe("Conflito ao processar a requisição"),
            500: z
              .object({
                message: z.string(),
              })
              .describe("Erro interno no servidor"),
          },
        },
      },
      create,
    );
    protectedRoutes.get(
      "/me",
      {
        schema: {
          tags: ["Surveys"],
          summary: "Listar pesquisas do coordenador",
          description:
            "Retorna todas as pesquisas criadas pelo coordenador autenticado com paginação.",
          security: [{ bearerAuth: [] }],
          querystring: fetchCoordinatorSurveysQuerySchema,
          response: {
            200: z
              .object({
                surveys: z.array(
                  z.object({
                    id: z.string(),
                    title: z.string(),
                    description: z.string().nullable(),
                    status: z.enum(["DRAFT", "OPEN", "CLOSED"]),
                    createdAt: z.date(),
                  }),
                ),
                meta: z.object({
                  page: z.number(),
                  perPage: z.number(),
                  totalCount: z.number(),
                  totalPages: z.number(),
                }),
              })
              .describe("Lista de pesquisas retornada com sucesso"),
            400: z
              .object({
                message: z.string(),
                issues: z.any().optional(),
              })
              .describe("Erro de validação na query string"),
            401: z
              .object({
                message: z.string(),
              })
              .describe("Token JWT ausente ou inválido"),
            403: z
              .object({
                message: z.string(),
              })
              .describe("Acesso negado: Apenas para Coordenadores"),
            500: z
              .object({
                message: z.string(),
              })
              .describe("Erro interno no servidor"),
          },
        },
      },
      fetchCoordinatorSurveys,
    );
    protectedRoutes.patch("/:id/status", toggleStatus);
    protectedRoutes.get("/:surveyId/results", getResults);
  });

  app.get(
    "/",
    {
      schema: {
        tags: ["Surveys"],
        summary: "Listar pesquisas abertas",
        description:
          "Retorna uma lista paginada de todas as pesquisas com status 'OPEN'.",
        querystring: fetchOpenSurveysQuerySchema,
        response: {
          200: z
            .object({
              surveys: z.array(
                z.object({
                  id: z.string(),
                  title: z.string(),
                  description: z.string().nullable(),
                  status: z.enum(["OPEN"]),
                  createdAt: z.date(),
                }),
              ),
              meta: z.object({
                page: z.number(),
                perPage: z.number(),
                totalCount: z.number(),
                totalPages: z.number(),
              }),
            })
            .describe("Lista de pesquisas abertas retornada com sucesso"),
          400: z
            .object({
              message: z.string(),
              issues: z.any().optional(),
            })
            .describe(
              "Erro de validação na query string (ex: página inválida)",
            ),
          500: z
            .object({
              message: z.string(),
            })
            .describe("Erro interno no servidor"),
        },
      },
    },
    fetchOpenSurveys,
  );

  // Only authenticated routes!
  app.register(async (authenticatedRoutes) => {
    authenticatedRoutes.addHook("onRequest", verifyJWT);

    authenticatedRoutes.post("/:surveyId/votes", voteOnSurvey);
  });
}
