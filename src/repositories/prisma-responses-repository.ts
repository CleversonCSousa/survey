import { Prisma } from "@prisma/client";
import { ResponseCount, ResponsesRepository } from "./responses-repository.ts";
import { prismaClient } from "@/lib/prisma/prismaClient.ts";

export class PrismaResponsesRepository implements ResponsesRepository {
  async createMany(data: Prisma.ResponseUncheckedCreateInput[]): Promise<void> {
    await prismaClient.response.createMany({
      data,
    });
  }
  async findByUserAndSurvey(userId: string, surveyId: string) {
    const response = await prismaClient.response.findFirst({
      where: {
        userId,
        surveyId,
      },
    });

    return response;
  }

  async countGroupBySurveyId(surveyId: string): Promise<ResponseCount[]> {
    const groups = await prismaClient.response.groupBy({
      by: ["optionId"],
      where: {
        surveyId,
      },
      _count: {
        optionId: true,
      },
    });

    return groups.map((group) => {
      return {
        optionId: group.optionId,
        count: group._count.optionId,
      };
    });
  }
}
