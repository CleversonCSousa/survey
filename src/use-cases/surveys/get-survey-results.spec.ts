import { beforeEach, describe, it, expect } from "vitest";
import { InMemorySurveysRepository } from "@/repositories/in-memory-surveys-repository.ts";
import { InMemoryResponsesRepository } from "@/repositories/in-memory-responses-repository.ts";
import { GetSurveyResultsUseCase } from "./get-survey-results.ts";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.ts";
import { NotAllowedError } from "../errors/not-allowed-error.ts";

let inMemorySurveysRepository: InMemorySurveysRepository;
let inMemoryResponsesRepository: InMemoryResponsesRepository;
let sut: GetSurveyResultsUseCase;

describe("Get Survey Results Use Case", () => {
  beforeEach(() => {
    inMemorySurveysRepository = new InMemorySurveysRepository();
    inMemoryResponsesRepository = new InMemoryResponsesRepository();
    sut = new GetSurveyResultsUseCase(
      inMemorySurveysRepository,
      inMemoryResponsesRepository,
    );
  });

  it("should be able to get survey results", async () => {
    const survey = await inMemorySurveysRepository.create({
      title: "Linguagem Favorita",
      coordinatorId: "coordinator-01",
      status: "CLOSED",
      questions: {
        create: [
          {
            text: "Qual você prefere?",
            order: 1,
            options: {
              create: [
                { id: "option-ts", text: "TypeScript" },
                { id: "option-js", text: "JavaScript" },
              ],
            },
          },
        ],
      },
    });

    const questionId = inMemorySurveysRepository.questions[0]?.id!;

    await inMemoryResponsesRepository.createMany([
      {
        userId: "user-01",
        surveyId: survey.id,
        questionId,
        optionId: "option-ts",
      },
      {
        userId: "user-02",
        surveyId: survey.id,
        questionId,
        optionId: "option-ts",
      },
      {
        userId: "user-03",
        surveyId: survey.id,
        questionId,
        optionId: "option-js",
      },
    ]);

    const { survey: results } = await sut.execute({
      surveyId: survey.id,
      userId: "coordinator-01",
    });

    expect(results.title).toEqual("Linguagem Favorita");
    expect(results.questions[0]?.totalVotes).toEqual(3);
    expect(results.questions[0]?.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "option-ts",
          count: 2,
          percentage: 66.67,
        }),
        expect.objectContaining({
          id: "option-js",
          count: 1,
          percentage: 33.33,
        }),
      ]),
    );
  });

  it("should not be able to get results from a non-existent survey", async () => {
    await expect(() =>
      sut.execute({
        surveyId: "non-existent-id",
        userId: "coordinator-01",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to get results if user is not the coordinator", async () => {
    const survey = await inMemorySurveysRepository.create({
      title: "Pesquisa Alheia",
      coordinatorId: "coordinator-owner",
      status: "CLOSED",
      questions: [] as any,
    });

    await expect(() =>
      sut.execute({
        surveyId: survey.id,
        userId: "coordinator-hacker",
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
