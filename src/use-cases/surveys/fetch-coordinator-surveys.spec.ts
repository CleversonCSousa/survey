import { beforeEach, describe, it, expect } from "vitest";
import { FetchCoordinatorSurveysUseCase } from "./fetch-coordinator-surveys.ts";
import { InMemorySurveysRepository } from "@/repositories/in-memory-surveys-repository.ts";

let inMemorySurveysRepository: InMemorySurveysRepository;
let sut: FetchCoordinatorSurveysUseCase;

describe("Fetch Coordinator Surveys Use Case", () => {
  beforeEach(() => {
    inMemorySurveysRepository = new InMemorySurveysRepository();
    sut = new FetchCoordinatorSurveysUseCase(inMemorySurveysRepository);
  });

  it("should be able to fetch paginated surveys with correct metadata", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemorySurveysRepository.create({
        title: `Survey ${i}`,
        coordinatorId: "coordinator-01",
        questions: [] as any,
        createdAt: new Date(2026, 2, i),
      });
    }

    const { surveys, meta } = await sut.execute({
      coordinatorId: "coordinator-01",
      page: 2,
    });

    expect(surveys).toHaveLength(2);
    expect(surveys[0]?.title).toEqual("Survey 2");

    expect(meta).toEqual(
      expect.objectContaining({
        totalCount: 22,
        totalPages: 2,
        page: 2,
        perPage: 20,
      }),
    );
  });

  it("should return empty list and correct meta when page is out of bounds", async () => {
    await inMemorySurveysRepository.create({
      title: "Survey 1",
      coordinatorId: "coordinator-01",
      questions: [] as any,
    });

    const { surveys, meta } = await sut.execute({
      coordinatorId: "coordinator-01",
      page: 5,
    });

    expect(surveys).toHaveLength(0);
    expect(meta.totalPages).toBe(1);
    expect(meta.page).toBe(5);
  });

  it("should not return surveys from other coordinators", async () => {
    await inMemorySurveysRepository.create({
      title: "Survey do Coordenador A",
      coordinatorId: "coordinator-A",
      questions: [] as any,
    });

    await inMemorySurveysRepository.create({
      title: "Survey do Coordenador B",
      coordinatorId: "coordinator-B",
      questions: [] as any,
    });

    const result = await sut.execute({
      coordinatorId: "coordinator-A",
      page: 1,
    });

    expect(result.surveys).toHaveLength(1);
    expect(result.meta.totalCount).toBe(1);
    expect(result.surveys[0]?.title).toEqual("Survey do Coordenador A");
  });
});
