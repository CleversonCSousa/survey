import {
  toggleStatusBodySchema,
  toggleStatusParamsSchema,
} from "@/http/schemas/surveys/toggle-status-schema.ts";
import { makeToggleSurveyStatusUseCase } from "@/use-cases/factories/make-toggle-survey-status.ts";
import { FastifyReply, FastifyRequest } from "fastify";

export async function toggleStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = toggleStatusParamsSchema.parse(request.params);
  const { status } = toggleStatusBodySchema.parse(request.body);

  const toggleSurveyStatusUseCase = makeToggleSurveyStatusUseCase();

  await toggleSurveyStatusUseCase.execute({
    surveyId: id,
    coordinatorId: request.user.sub,
    status,
  });

  return reply.status(204).send();
}
