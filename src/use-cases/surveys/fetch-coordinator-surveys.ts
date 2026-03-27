import { SurveysRepository } from "@/repositories/surveys-repository.ts";
import { Survey } from "@prisma/client";

interface FetchCoordinatorSurveysUseCaseRequest {
  coordinatorId: string;
  page: number;
}

interface FetchCoordinatorSurveysUseCaseResponse {
  surveys: Survey[];
  meta: {
    page: number;
    perPage: number;
    totalCount: number;
    totalPages: number;
  };
}

export class FetchCoordinatorSurveysUseCase {
  constructor(private surveysRepository: SurveysRepository) {}

  async execute({
    page,
    coordinatorId,
  }: FetchCoordinatorSurveysUseCaseRequest): Promise<FetchCoordinatorSurveysUseCaseResponse> {
    const { surveys, totalCount } =
      await this.surveysRepository.findManyByCoordinatorId(coordinatorId, page);

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
