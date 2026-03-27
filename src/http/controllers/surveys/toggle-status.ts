import { makeToggleSurveyStatusUseCase } from "@/use-cases/factories/make-toggle-survey-status.ts";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function toggleStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const toggleStatusParamsSchema = z.object({
    id: z.uuid(),
  });

  const toggleStatusBodySchema = z.object({
    status: z.enum(["OPEN", "CLOSED", "DRAFT"]),
  });

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
