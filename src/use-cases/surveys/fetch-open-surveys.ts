import { Survey } from "@prisma/client";
import { SurveysRepository } from "@/repositories/surveys-repository.ts";

interface FetchOpenSurveysUseCaseRequest {
  page: number;
}

interface FetchOpenSurveysUseCaseResponse {
  surveys: Survey[];
  meta: {
    page: number;
    perPage: number;
    totalCount: number;
    totalPages: number;
  };
}

export class FetchOpenSurveysUseCase {
  constructor(private surveysRepository: SurveysRepository) {}

  async execute({
    page,
  }: FetchOpenSurveysUseCaseRequest): Promise<FetchOpenSurveysUseCaseResponse> {
    const { surveys, totalCount } =
      await this.surveysRepository.findManyOpen(page);

    const totalPages = Math.ceil(totalCount / 20);

    return {
      surveys,
      meta: {
        page,
        perPage: 20,
        totalCount,
        totalPages,
      },
    };
  }
}
