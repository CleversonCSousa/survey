import { Prisma, Survey, Question, Option } from "@prisma/client";
import { SurveysRepository } from "../surveys-repository";
import { randomUUID } from "node:crypto";

export class InMemorySurveysRepository implements SurveysRepository {
  public items: Survey[] = [];
  public questions: Question[] = [];
  public options: Option[] = [];

  async create(data: Prisma.SurveyUncheckedCreateInput) {
    const survey: Survey = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? "DRAFT",
      coordinatorId: data.coordinatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(survey);

    // Simulando o Nested Write do Prisma para Questions
    if (data.questions?.create) {
      const questionsToCreate = Array.isArray(data.questions.create)
        ? data.questions.create
        : [data.questions.create];

      questionsToCreate.forEach((q) => {
        const question: Question = {
          id: randomUUID(),
          surveyId: survey.id,
          text: q.text,
          order: q.order,
        };

        this.questions.push(question);

        // Simulando o Nested Write para Options
        if (q.options?.create) {
          const optionsToCreate = Array.isArray(q.options.create)
            ? q.options.create
            : [q.options.create];

          optionsToCreate.forEach((o) => {
            this.options.push({
              id: randomUUID(),
              questionId: question.id,
              text: o.text,
            });
          });
        }
      });
    }

    return survey;
  }
}
