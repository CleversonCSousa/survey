import { PrismaSurveysRepository } from "@/repositories/prisma-surveys-repository.ts";
import { CreateSurveyUseCase } from "../surveys/create.ts";

export function makeCreateSurveyUseCase() {
  const surveysRepository = new PrismaSurveysRepository();
  const useCase = new CreateSurveyUseCase(surveysRepository);

  return useCase;
}
