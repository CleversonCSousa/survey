import { getResultsParamsSchema } from "@/http/schemas/surveys/get-results-schema.ts";
import { makeGetSurveysResultsUseCase } from "@/use-cases/factories/make-get-survey-results-use-case.ts";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getResults(request: FastifyRequest, reply: FastifyReply) {
  const { surveyId } = getResultsParamsSchema.parse(request.params);

  const getSurveysResultsUseCase = makeGetSurveysResultsUseCase();
  const { survey } = await getSurveysResultsUseCase.execute({
    surveyId,
    userId: request.user.sub,
  });

  return reply.status(200).send({
    survey,
  });
}
