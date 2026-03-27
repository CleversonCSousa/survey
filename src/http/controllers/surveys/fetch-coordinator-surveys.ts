import { makeFetchCoordinatorSurveysUseCase } from "@/use-cases/factories/make-fetch-coordinator-surveys.ts";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function fetchCoordinatorSurveys(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchCoordinatorSurveysQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = fetchCoordinatorSurveysQuerySchema.parse(request.query);

  const fetchCoordinatorSurveysUseCase = makeFetchCoordinatorSurveysUseCase();

  const { surveys, meta } = await fetchCoordinatorSurveysUseCase.execute({
    coordinatorId: request.user.sub,
    page,
  });

  return reply.status(200).send({
    surveys: surveys.map((survey) => {
      const { coordinatorId, ...surveyWithoutCoordinatorId } = survey;
      return surveyWithoutCoordinatorId;
    }),
    meta,
  });
}
