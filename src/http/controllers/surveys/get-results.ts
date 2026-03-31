import { makeGetSurveysResultsUseCase } from "@/use-cases/factories/make-get-survey-results-use-case.ts";
import { makeToggleSurveyStatusUseCase } from "@/use-cases/factories/make-toggle-survey-status.ts";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getResults(request: FastifyRequest, reply: FastifyReply) {
  const getResultsParamsSchema = z.object({
    surveyId: z.uuid(),
  });

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
