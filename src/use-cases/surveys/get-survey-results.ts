import { ResponsesRepository } from "@/repositories/responses-repository.ts";
import { SurveysRepository } from "@/repositories/surveys-repository.ts";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.ts";
import { NotAllowedError } from "../errors/not-allowed-error.ts";
import { redis } from "@/lib/redis/redis.ts";

interface GetSurveyResultsUseCaseRequest {
  surveyId: string;
  userId: string;
}

interface GetSurveyResultsUseCaseResponse {
  survey: {
    id: string;
    title: string;
    status: string;
    questions: {
      id: string;
      text: string;
      totalVotes: number;
      options: {
        id: string;
        text: string;
        count: number;
        percentage: number;
      }[];
    }[];
  };
}

export class GetSurveyResultsUseCase {
  constructor(
    private surveysRepository: SurveysRepository,
    private responsesRepository: ResponsesRepository,
  ) {}

  async execute({
    surveyId,
    userId,
  }: GetSurveyResultsUseCaseRequest): Promise<GetSurveyResultsUseCaseResponse> {
    const survey = await this.surveysRepository.findByIdWithQuestions(surveyId);

    if (!survey) {
      throw new ResourceNotFoundError();
    }

    if (survey.coordinatorId !== userId) {
      throw new NotAllowedError();
    }
    const cacheKey = `survey:${surveyId}:results`;
    const cachedResults = await redis.get(cacheKey);

    if (cachedResults) {
      return {
        survey: JSON.parse(cachedResults),
      };
    }

    const counts =
      await this.responsesRepository.countGroupBySurveyId(surveyId);

    const countsMap = new Map(counts.map((c) => [c.optionId, c.count]));

    const questions = survey.questions.map((question) => {
      const totalVotes = question.options.reduce((sum, option) => {
        const count = countsMap.get(option.id) || 0;
        return sum + count;
      }, 0);

      const options = question.options.map((option) => {
        const count = countsMap.get(option.id) || 0;

        const percentage =
          totalVotes > 0 ? Number(((count / totalVotes) * 100).toFixed(2)) : 0;

        return {
          id: option.id,
          text: option.text,
          count,
          percentage,
        };
      });

      return {
        id: question.id,
        text: question.text,
        totalVotes,
        options,
      };
    });

    await redis.set(
      cacheKey,
      JSON.stringify({
        id: surveyId,
        title: survey.title,
        status: survey.status,
        questions,
      }),
      "EX",
      60,
    );

    return {
      survey: {
        id: survey.id,
        title: survey.title,
        status: survey.status,
        questions,
      },
    };
  }
}
