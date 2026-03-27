import { Prisma, Survey } from "@prisma/client";

export interface SurveysRepository {
  create(data: Prisma.SurveyUncheckedCreateInput): Promise<Survey>;
  findManyByCoordinatorId(
    coordinatorId: string,
    page: number,
  ): Promise<{
    surveys: Survey[];
    totalCount: number;
  }>;
}
