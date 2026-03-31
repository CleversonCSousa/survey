import { Prisma, Survey } from "@prisma/client";
import { prismaClient } from "@/lib/prisma/prismaClient.ts";
import {
  SurveysRepository,
  SurveyWithQuestionsAndOptions,
} from "./surveys-repository.ts";
import { SurveyStatus } from "@/@types/SurveyStatus.ts";

export class PrismaSurveysRepository implements SurveysRepository {
  async create(data: Prisma.SurveyUncheckedCreateInput) {
    const survey = await prismaClient.survey.create({
      data,
    });
    return survey;
  }
  async findManyByCoordinatorId(coordinatorId: string, page: number) {
    const [surveys, totalCount] = await prismaClient.$transaction([
      prismaClient.survey.findMany({
        where: { coordinatorId },
        take: 20,
        skip: (page - 1) * 20,
        orderBy: { createdAt: "desc" },
      }),
      prismaClient.survey.count({
        where: { coordinatorId },
      }),
    ]);

    return {
      surveys,
      totalCount,
    };
  }

  async findById(id: string): Promise<Survey | null> {
    const survey = await prismaClient.survey.findUnique({
      where: {
        id,
      },
    });

    return survey;
  }

  async findByIdWithQuestions(
    id: string,
  ): Promise<SurveyWithQuestionsAndOptions | null> {
    const survey = await prismaClient.survey.findUnique({
      where: {
        id,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return survey;
  }

  async save(survey: Survey): Promise<Survey> {
    const surveyCreated = await prismaClient.survey.update({
      data: survey,
      where: {
        id: survey.id,
      },
    });

    return surveyCreated;
  }

  async findManyOpen(page: number) {
    const [surveys, totalCount] = await prismaClient.$transaction([
      prismaClient.survey.findMany({
        where: {
          status: "OPEN",
        },
        take: 20,
        skip: (page - 1) * 20,
        orderBy: { createdAt: "desc" },
      }),
      prismaClient.survey.count({
        where: {
          status: "OPEN",
        },
      }),
    ]);

    return {
      surveys,
      totalCount,
    };
  }
}
