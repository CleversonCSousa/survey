import { PrismaSurveysRepository } from "@/repositories/prisma-surveys-repository.ts";
import { FetchCoordinatorSurveysUseCase } from "../surveys/fetch-coordinator-surveys.ts";

export function makeFetchCoordinatorSurveysUseCase() {
  const surveysRepository = new PrismaSurveysRepository();
  const useCase = new FetchCoordinatorSurveysUseCase(surveysRepository);

  return useCase;
}
