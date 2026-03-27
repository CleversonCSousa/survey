import { NotAllowedError } from "@/use-cases/errors/not-allowed-error.ts";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.ts";
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

  return reply.status(500).send({ message: "Internal server error." });
};
