import { ResponsesRepository } from "@/repositories/responses-repository.ts";
import { SurveysRepository } from "@/repositories/surveys-repository.ts";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.ts";
import { IncompleteResponseError } from "../errors/incomplete-response-error.ts";
import { SurveyNotOpenError } from "../errors/survey-not-open-error.ts";
import { UserAlreadyRespondedError } from "../errors/user-already-responded-error.ts";

interface VoteOnSurveyUseCaseRequest {
  userId: string;
  surveyId: string;
  responses: {
    questionId: string;
    optionId: string;
  }[];
}

export class VoteOnSurveyUseCase {
  constructor(
    private responsesRepository: ResponsesRepository,
    private surveysRepository: SurveysRepository,
  ) {}

  async execute({ surveyId, responses, userId }: VoteOnSurveyUseCaseRequest) {
    const survey = await this.surveysRepository.findByIdWithQuestions(surveyId);
    if (!survey || !survey.questions) {
      throw new ResourceNotFoundError();
    }

    const userAlreadyResponded =
      await this.responsesRepository.findByUserAndSurvey(userId, surveyId);

    if (userAlreadyResponded) {
      throw new UserAlreadyRespondedError();
    }

    if (survey.questions.length !== responses.length) {
      throw new IncompleteResponseError();
    }

    if (survey.status !== "OPEN") {
      throw new SurveyNotOpenError();
    }

    const responsesFormatted = responses.map((response) => {
      return {
        userId,
        surveyId,
        optionId: response.optionId,
        questionId: response.questionId,
      };
    });

    await this.responsesRepository.createMany(responsesFormatted);
  }
}
