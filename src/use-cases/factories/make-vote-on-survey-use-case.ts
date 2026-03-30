import { PrismaSurveysRepository } from "@/repositories/prisma-surveys-repository.ts";
import { PrismaResponsesRepository } from "@/repositories/prisma-responses-repository.ts";
import { VoteOnSurveyUseCase } from "../surveys/vote-on-survey.ts";

export function makeVoteOnSurveyUseCase() {
  const surveysRepository = new PrismaSurveysRepository();
  const responsesRepository = new PrismaResponsesRepository();
  const useCase = new VoteOnSurveyUseCase(
    responsesRepository,
    surveysRepository,
  );

  return useCase;
}
