import { FastifyReply, FastifyRequest } from "fastify";
import { InvalidSurveyStructureError } from "@/use-cases/errors/invalid-survey-structure-error.ts";
import { makeCreateSurveyUseCase } from "@/use-cases/factories/make-create-survey-use-case.ts";
import { createSurveyBodySchema } from "@/http/schemas/surveys/create-survey-body-schema.ts";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { questions, status, title, description } =
      createSurveyBodySchema.parse(request.body);
    const coordinatorId = request.user.sub;
    const createUseCase = makeCreateSurveyUseCase();

    await createUseCase.execute({
      title,
      coordinatorId,
      questions,
      description,
      status,
    });
  } catch (err) {
    if (err instanceof InvalidSurveyStructureError) {
      return reply.status(400).send({
        message: err.message,
      });
    }
    return reply.status(500).send();
  }

  return reply.status(201).send();
}
