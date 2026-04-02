import { fetchOpenSurveysQuerySchema } from "@/http/schemas/surveys/fetch-open-surveys-schema.ts";
import { makeFetchOpenSurveysUseCase } from "@/use-cases/factories/make-fetch-open-surveys.ts";
import { FastifyReply, FastifyRequest } from "fastify";

export async function fetchOpenSurveys(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page } = fetchOpenSurveysQuerySchema.parse(request.query);

  const fetchOpenSurveysUseCase = makeFetchOpenSurveysUseCase();

  const { surveys, meta } = await fetchOpenSurveysUseCase.execute({
    page,
  });

  return reply.status(200).send({
    surveys: surveys.map((survey) => ({
      id: survey.id,
      title: survey.title,
      description: survey.description,
      status: survey.status,
      createdAt: survey.createdAt,
    })),
    meta,
  });
}
