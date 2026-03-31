import { PrismaSurveysRepository } from "@/repositories/prisma-surveys-repository.ts";
import { GetSurveyResultsUseCase } from "../surveys/get-survey-results.ts";
import { PrismaResponsesRepository } from "@/repositories/prisma-responses-repository.ts";

export function makeGetSurveysResultsUseCase() {
  const surveysRepository = new PrismaSurveysRepository();
  const responsesRepository = new PrismaResponsesRepository();

  const useCase = new GetSurveyResultsUseCase(
    surveysRepository,
    responsesRepository,
  );

  return useCase;
}
