import { fetchCoordinatorSurveysQuerySchema } from "@/http/schemas/surveys/fetch-coordinator-surveys-schema.ts";
import { makeFetchCoordinatorSurveysUseCase } from "@/use-cases/factories/make-fetch-coordinator-surveys.ts";
import { FastifyReply, FastifyRequest } from "fastify";

export async function fetchCoordinatorSurveys(
  request: FastifyRequest,
  reply: FastifyReply,
) {
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
