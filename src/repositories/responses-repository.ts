import { Prisma, Response } from "@prisma/client";

export interface ResponsesRepository {
  createMany(data: Prisma.ResponseUncheckedCreateInput[]): Promise<void>;
  findByUserAndSurvey(
    userId: string,
    surveyId: string,
  ): Promise<Response | null>;
}
