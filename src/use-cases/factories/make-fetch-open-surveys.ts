import { PrismaSurveysRepository } from "@/repositories/prisma-surveys-repository.ts";
import { FetchOpenSurveysUseCase } from "../surveys/fetch-open-surveys.ts";

export function makeFetchOpenSurveysUseCase() {
  const surveysRepository = new PrismaSurveysRepository();
  const useCase = new FetchOpenSurveysUseCase(surveysRepository);

  return useCase;
}
