import { beforeEach, describe, expect, it } from "vitest";
import { CreateSurveyUseCase } from "./create.ts";
import { InMemorySurveysRepository } from "@/repositories/in-memory-surveys-repository.ts";
import { InvalidSurveyStructureError } from "../errors/invalid-survey-structure-error.ts";

let surveysRepository: InMemorySurveysRepository;
let sut: CreateSurveyUseCase;

describe("Create Survey Use Case", () => {
  beforeEach(() => {
    surveysRepository = new InMemorySurveysRepository();
    sut = new CreateSurveyUseCase(surveysRepository);
  });

  it("should be able to create a survey with multiple questions and options", async () => {
    const { survey } = await sut.execute({
      title: "Pesquisa de Satisfação USP",
      description: "Queremos saber sua opinião sobre o ICMC.",
      coordinatorId: "coordinator-01",
      status: "OPEN",
      questions: [
        {
          text: "O que você acha do curso?",
          options: ["Excelente", "Bom", "Pode melhorar"],
        },
        {
          text: "Você recomendaria a USP?",
          options: ["Sim", "Não"],
        },
      ],
    });

    expect(survey.id).toEqual(expect.any(String));
    expect(survey.title).toBe("Pesquisa de Satisfação USP");
    expect(survey.status).toBe("OPEN");

    expect(surveysRepository.questions).toHaveLength(2);
    expect(surveysRepository.questions[0]!.order).toBe(1);
    expect(surveysRepository.questions[1]!.order).toBe(2);

    expect(surveysRepository.options).toHaveLength(5);
  });
  it("should be able to create a survey with exactly one option", async () => {
    const { survey } = await sut.execute({
      title: "Termos de Uso",
      coordinatorId: "coordinator-01",
      questions: [
        {
          text: "Você aceita os termos?",
          options: ["Aceito"],
        },
      ],
      description: "",
    });

    expect(survey.id).toEqual(expect.any(String));
    expect(surveysRepository.options).toHaveLength(1);
  });
  it("should not be able to create a survey with more than 10 questions", async () => {
    const manyQuestions = Array.from({ length: 11 }, (_, i) => ({
      text: `Pergunta ${i + 1}`,
      options: ["Opção 1"],
    }));

    await expect(() =>
      sut.execute({
        title: "Pesquisa Longa demais",
        coordinatorId: "coordinator-01",
        questions: manyQuestions,
        description: "",
      }),
    ).rejects.toBeInstanceOf(InvalidSurveyStructureError);
  });
  it("should not be able to create a question with more than 5 options", async () => {
    await expect(() =>
      sut.execute({
        title: "Muitas Opções",
        coordinatorId: "coordinator-01",
        questions: [
          {
            text: "Escolha uma cor",
            options: [
              "Azul",
              "Verde",
              "Amarelo",
              "Vermelho",
              "Preto",
              "Branco",
            ],
          },
        ],
        description: "",
      }),
    ).rejects.toBeInstanceOf(InvalidSurveyStructureError);
  });
});
