import { beforeEach, describe, it, expect } from "vitest";
import { InMemorySurveysRepository } from "@/repositories/in-memory-surveys-repository.ts";
import { VoteOnSurveyUseCase } from "./vote-on-survey.ts";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.ts";
import { SurveyNotOpenError } from "../errors/survey-not-open-error.ts";
import { UserAlreadyRespondedError } from "../errors/user-already-responded-error.ts";
import { IncompleteResponseError } from "../errors/incomplete-response-error.ts";
import { InMemoryResponsesRepository } from "@/repositories/in-memory-responses-repository.ts";

let inMemorySurveysRepository: InMemorySurveysRepository;
let inMemoryResponsesRepository: InMemoryResponsesRepository;
let sut: VoteOnSurveyUseCase;

describe("Vote On Survey Use Case", () => {
  beforeEach(() => {
    inMemorySurveysRepository = new InMemorySurveysRepository();
    inMemoryResponsesRepository = new InMemoryResponsesRepository();
    sut = new VoteOnSurveyUseCase(
      inMemoryResponsesRepository,
      inMemorySurveysRepository,
    );
  });

  it("should be able to vote on a survey", async () => {
    const survey = await inMemorySurveysRepository.create({
      title: "Pesquisa de Satisfação",
      coordinatorId: "coordinator-01",
      status: "OPEN",
      questions: {
        create: [{ text: "Pergunta 1", order: 1 }],
      } as any,
    });

    const questionId = inMemorySurveysRepository.questions[0]?.id!;

    await sut.execute({
      surveyId: survey.id,
      userId: "user-01",
      responses: [{ questionId, optionId: "option-01" }],
    });

    expect(inMemoryResponsesRepository.items).toHaveLength(1);
    expect(inMemoryResponsesRepository.items[0]).toMatchObject({
      userId: "user-01",
      surveyId: survey.id,
      questionId,
    });
  });

  it("should not be able to vote on a non-existent survey", async () => {
    await expect(() =>
      sut.execute({
        surveyId: "non-existent-id",
        userId: "user-01",
        responses: [{ questionId: "q1", optionId: "o1" }],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to vote on a survey that is not OPEN", async () => {
    const survey = await inMemorySurveysRepository.create({
      title: "Pesquisa em Rascunho",
      coordinatorId: "coordinator-01",
      status: "DRAFT",
      questions: {
        create: [{ text: "Pergunta 1", order: 1 }],
      } as any,
    });

    const questionId = inMemorySurveysRepository.questions[0]?.id!;

    await expect(() =>
      sut.execute({
        surveyId: survey.id,
        userId: "user-01",
        responses: [{ questionId, optionId: "o1" }],
      }),
    ).rejects.toBeInstanceOf(SurveyNotOpenError);
  });

  it("should not be able to vote twice on the same survey", async () => {
    const survey = await inMemorySurveysRepository.create({
      title: "Pesquisa Única",
      coordinatorId: "coordinator-01",
      status: "OPEN",
      questions: {
        create: [{ text: "Pergunta 1", order: 1 }],
      } as any,
    });

    const questionId = inMemorySurveysRepository.questions[0]?.id!;

    await sut.execute({
      surveyId: survey.id,
      userId: "user-01",
      responses: [{ questionId, optionId: "o1" }],
    });

    await expect(() =>
      sut.execute({
        surveyId: survey.id,
        userId: "user-01",
        responses: [{ questionId, optionId: "o1" }],
      }),
    ).rejects.toBeInstanceOf(UserAlreadyRespondedError);
  });

  it("should not be able to vote with incomplete responses", async () => {
    const survey = await inMemorySurveysRepository.create({
      title: "Pesquisa Longa",
      coordinatorId: "coordinator-01",
      status: "OPEN",
      questions: {
        create: [
          { text: "P1", order: 1 },
          { text: "P2", order: 2 },
        ],
      } as any,
    });

    const questionId = inMemorySurveysRepository.questions[0]?.id!;

    await expect(() =>
      sut.execute({
        surveyId: survey.id,
        userId: "user-01",
        responses: [{ questionId, optionId: "o1" }],
      }),
    ).rejects.toBeInstanceOf(IncompleteResponseError);
  });
});
