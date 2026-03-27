import { Survey } from "@prisma/client";
import { SurveyStatus } from "@/@types/SurveyStatus.ts";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.ts";
import { SurveysRepository } from "@/repositories/surveys-repository.ts";
import { NotAllowedError } from "../errors/not-allowed-error.ts";

interface ToggleSurveyStatusUseCaseRequest {
  surveyId: string;
  coordinatorId: string;
  status: SurveyStatus;
}

interface ToggleSurveyStatusUseCaseResponse {
  survey: Survey;
}

export class ToggleSurveyStatusUseCase {
  constructor(private surveysRepository: SurveysRepository) {}

  async execute({
    surveyId,
    coordinatorId,
    status,
  }: ToggleSurveyStatusUseCaseRequest): Promise<ToggleSurveyStatusUseCaseResponse> {
    const survey = await this.surveysRepository.findById(surveyId);

    if (!survey) {
      throw new ResourceNotFoundError();
    }

    if (survey.coordinatorId !== coordinatorId) {
      throw new NotAllowedError();
    }

    survey.status = status;
    survey.updatedAt = new Date();

    await this.surveysRepository.save(survey);

    return { survey };
  }
}
