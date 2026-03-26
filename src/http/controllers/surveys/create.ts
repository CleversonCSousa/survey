import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaSurveysRepository } from "@/repositories/prisma-surveys-repository.ts";
import { CreateSurveyUseCase } from "@/use-cases/surveys/create.ts";
import { InvalidSurveyStructureError } from "@/use-cases/errors/invalid-survey-structure-error.ts";
import { makeCreateSurveyUseCase } from "@/use-cases/factories/make-create-survey-use-case.ts";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createSurveyBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    questions: z.array(
      z.object({
        text: z.string(),
        options: z.array(z.string().min(1)),
      }),
    ),
    status: z.enum(["DRAFT", "OPEN", "CLOSED"]).optional().default("DRAFT"),
  });

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
