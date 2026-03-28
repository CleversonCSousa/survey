import { beforeEach, describe, it, expect } from "vitest";
import { FetchOpenSurveysUseCase } from "./fetch-open-surveys.ts";
import { InMemorySurveysRepository } from "@/repositories/in-memory-surveys-repository.ts";

let inMemorySurveysRepository: InMemorySurveysRepository;
let sut: FetchOpenSurveysUseCase;

describe("Fetch Open Surveys Use Case", () => {
  beforeEach(() => {
    inMemorySurveysRepository = new InMemorySurveysRepository();
    sut = new FetchOpenSurveysUseCase(inMemorySurveysRepository);
  });

  it("should be able to fetch open surveys", async () => {
    await inMemorySurveysRepository.create({
      title: "Open Survey",
      coordinatorId: "coordinator-01",
      status: "OPEN",
    });

    await inMemorySurveysRepository.create({
      title: "Draft Survey",
      coordinatorId: "coordinator-01",
      status: "DRAFT",
    });

    const { surveys, meta } = await sut.execute({ page: 1 });

    expect(surveys).toHaveLength(1);
    expect(surveys[0]?.title).toEqual("Open Survey");
    expect(meta.totalCount).toBe(1);
  });

  it("should be able to fetch paginated open surveys", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemorySurveysRepository.create({
        title: `Survey ${i}`,
        coordinatorId: "coordinator-01",
        status: "OPEN",
      });
    }

    const { surveys, meta } = await sut.execute({ page: 2 });

    expect(surveys).toHaveLength(2);
    expect(meta.totalPages).toBe(2);
  });
});
