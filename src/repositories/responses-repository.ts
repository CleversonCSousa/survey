import { Prisma, Response } from "@prisma/client";

export interface ResponseCount {
  optionId: string;
  count: number;
}

export interface ResponsesRepository {
  createMany(data: Prisma.ResponseUncheckedCreateInput[]): Promise<void>;
  findByUserAndSurvey(
    userId: string,
    surveyId: string,
  ): Promise<Response | null>;
  countGroupBySurveyId(surveyId: string): Promise<ResponseCount[]>;
}
