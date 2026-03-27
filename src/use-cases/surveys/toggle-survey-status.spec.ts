import { beforeEach, describe, it, expect } from "vitest";
import { InMemorySurveysRepository } from "@/repositories/in-memory-surveys-repository.ts";
import { ToggleSurveyStatusUseCase } from "./toggle-survey-status.ts";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.ts";
import { NotAllowedError } from "../errors/not-allowed-error.ts";

let inMemorySurveysRepository: InMemorySurveysRepository;
let sut: ToggleSurveyStatusUseCase;

describe("Toggle Survey Status Use Case", () => {
  beforeEach(() => {
    inMemorySurveysRepository = new InMemorySurveysRepository();
    sut = new ToggleSurveyStatusUseCase(inMemorySurveysRepository);
  });

  it("should be able to toggle survey status", async () => {
    const survey = await inMemorySurveysRepository.create({
      title: "Nova Pesquisa",
      coordinatorId: "coordinator-01",
      questions: [] as any,
    });

    const { survey: updatedSurvey } = await sut.execute({
      surveyId: survey.id,
      coordinatorId: "coordinator-01",
      status: "OPEN",
    });

    expect(updatedSurvey.status).toEqual("OPEN");
    expect(inMemorySurveysRepository.items[0]?.status).toEqual("OPEN");
  });

  it("should not be able to toggle status of a non-existent survey", async () => {
    await expect(() =>
      sut.execute({
        surveyId: "non-existent-id",
        coordinatorId: "coordinator-01",
        status: "OPEN",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to toggle status of a survey from another coordinator", async () => {
    const survey = await inMemorySurveysRepository.create({
      title: "Pesquisa Alheia",
      coordinatorId: "coordinator-owner",
      questions: [] as any,
    });

    await expect(() =>
      sut.execute({
        surveyId: survey.id,
        coordinatorId: "coordinator-hacker",
        status: "OPEN",
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
