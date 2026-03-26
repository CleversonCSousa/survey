import { Prisma, Survey, User } from "@prisma/client";

export interface SurveysRepository {
  create(data: Prisma.SurveyUncheckedCreateInput): Promise<Survey>;
}
