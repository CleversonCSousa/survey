import { SurveysRepository } from "@/repositories/surveys-repository.ts";
import { Survey } from "@prisma/client";
import { InvalidSurveyStructureError } from "../errors/invalid-survey-structure-error.ts";

interface CreateSurveyUseCaseRequest {
  title: string;
  description: string | undefined;
  coordinatorId: string;
  questions: {
    text: string;
    options: string[];
  }[];
  status?: "DRAFT" | "OPEN" | "CLOSED";
}

interface CreateSurveyUseCaseResponse {
  survey: Survey;
}

export class CreateSurveyUseCase {
  constructor(private surveysRepository: SurveysRepository) {}

  async execute({
    title,
    description,
    coordinatorId,
    questions,
    status,
  }: CreateSurveyUseCaseRequest): Promise<CreateSurveyUseCaseResponse> {
    if (questions.length < 1 || questions.length > 10) {
      throw new InvalidSurveyStructureError();
    }
    const hasInvalidOptionsCount = questions.some(
      (question) => question.options.length < 1 || question.options.length > 5,
    );

    if (hasInvalidOptionsCount) {
      throw new InvalidSurveyStructureError();
    }

    const survey = await this.surveysRepository.create({
      title,
      description: description ?? null,
      coordinatorId,
      questions: {
        create: questions.map((question, index) => ({
          text: question.text,
          order: index + 1,
          options: {
            create: question.options.map((option) => ({
              text: option,
            })),
          },
        })),
      },
      status: status ?? "DRAFT",
    });

    return { survey };
  }
}
