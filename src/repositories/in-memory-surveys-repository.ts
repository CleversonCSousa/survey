import { Prisma, Survey, Question, Option } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { SurveysRepository } from "./surveys-repository.ts";

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
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: new Date(),
    };

    this.items.push(survey);

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
  async findManyByCoordinatorId(coordinatorId: string, page: number) {
    const allItems = this.items
      .filter((item) => item.coordinatorId === coordinatorId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const surveys = allItems.slice((page - 1) * 20, page * 20);

    return {
      surveys,
      totalCount: allItems.length,
    };
  }

  async findById(id: string) {
    const survey = this.items.find((item) => item.id === id);

    if (!survey) {
      return null;
    }

    return survey;
  }

  async save(survey: Survey) {
    const itemIndex = this.items.findIndex((item) => item.id === survey.id);

    if (itemIndex >= 0) {
      this.items[itemIndex] = survey;
    }

    return survey;
  }
}
