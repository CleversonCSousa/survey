import { Prisma, Response } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { ResponsesRepository } from "./responses-repository.ts";

export class InMemoryResponsesRepository implements ResponsesRepository {
  public items: Response[] = [];

  async createMany(data: Prisma.ResponseUncheckedCreateInput[]): Promise<void> {
    const newResponses = data.map((item: any) => {
      return {
        id: item.id ?? randomUUID(),
        userId: item.userId,
        surveyId: item.surveyId,
        questionId: item.questionId,
        optionId: item.optionId,
        createdAt: new Date(),
      } as Response;
    });

    this.items.push(...newResponses);
  }

  async findByUserAndSurvey(userId: string, surveyId: string) {
    const response = this.items.find(
      (item) => item.userId === userId && item.surveyId === surveyId,
    );

    if (!response) {
      return null;
    }

    return response;
  }
}
