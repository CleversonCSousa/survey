import { voteOnSurveyParamsSchema } from "@/http/schemas/surveys/vote-on-survey-schema.ts";
import { makeVoteOnSurveyUseCase } from "@/use-cases/factories/make-vote-on-survey-use-case.ts";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function voteOnSurvey(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const voteOnSurveyBodySchema = z.object({
    responses: z
      .array(
        z.object({
          questionId: z.uuid(),
          optionId: z.uuid(),
        }),
      )
      .min(1),
  });

  const { surveyId } = voteOnSurveyParamsSchema.parse(request.params);
  const { responses } = voteOnSurveyBodySchema.parse(request.body);

  const voteOnSurveyUseCase = makeVoteOnSurveyUseCase();

  await voteOnSurveyUseCase.execute({
    responses,
    surveyId,
    userId: request.user.sub,
  });

  return reply.status(201).send();
}
