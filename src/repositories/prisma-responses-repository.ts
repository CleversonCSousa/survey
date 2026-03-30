import { Prisma } from "@prisma/client";
import { ResponsesRepository } from "./responses-repository.ts";
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
}
