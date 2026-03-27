import { PrismaSurveysRepository } from "@/repositories/prisma-surveys-repository.ts";
import { ToggleSurveyStatusUseCase } from "../surveys/toggle-survey-status.ts";

export function makeToggleSurveyStatusUseCase() {
  const surveysRepository = new PrismaSurveysRepository();
  const useCase = new ToggleSurveyStatusUseCase(surveysRepository);

  return useCase;
}
