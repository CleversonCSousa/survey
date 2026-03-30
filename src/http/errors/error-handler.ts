import { IncompleteResponseError } from "@/use-cases/errors/incomplete-response-error.ts";
import { NotAllowedError } from "@/use-cases/errors/not-allowed-error.ts";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.ts";
import { SurveyNotOpenError } from "@/use-cases/errors/survey-not-open-error.ts";
import { UserAlreadyRespondedError } from "@/use-cases/errors/user-already-responded-error.ts";
import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
export const errorHandler: FastifyInstance["errorHandler"] = (
  error,
  _,
  reply,
) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    });
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: error.message });
  }

  if (error instanceof NotAllowedError) {
    return reply.status(403).send({ message: error.message });
  }

  if (error instanceof SurveyNotOpenError) {
    return reply.status(403).send({ message: error.message });
  }

  if (error instanceof IncompleteResponseError) {
    return reply.status(400).send({ message: error.message });
  }

  if (error instanceof UserAlreadyRespondedError) {
    return reply.status(409).send({ message: error.message });
  }

  return reply.status(500).send({ message: "Internal server error." });
};
