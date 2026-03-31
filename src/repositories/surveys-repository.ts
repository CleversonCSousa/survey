import { Option, Prisma, Question, Survey } from "@prisma/client";

export type SurveyWithQuestionsAndOptions = Survey & {
  questions: (Question & {
    options: Option[];
  })[];
};
export interface SurveysRepository {
  create(data: Prisma.SurveyUncheckedCreateInput): Promise<Survey>;
  findManyByCoordinatorId(
    coordinatorId: string,
    page: number,
  ): Promise<{
    surveys: Survey[];
    totalCount: number;
  }>;
  findById(id: string): Promise<Survey | null>;
  save(survey: Survey): Promise<Survey>;
  findManyOpen(page: number): Promise<{
    surveys: Survey[];
    totalCount: number;
  }>;
  findByIdWithQuestions(
    id: string,
  ): Promise<SurveyWithQuestionsAndOptions | null>;
}
