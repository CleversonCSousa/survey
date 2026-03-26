import { Prisma } from "@prisma/client";
import { prismaClient } from "@/lib/prisma/prismaClient.ts";
import { SurveysRepository } from "./surveys-repository.ts";

export class PrismaSurveysRepository implements SurveysRepository {
  async create(data: Prisma.SurveyUncheckedCreateInput) {
    const survey = await prismaClient.survey.create({
      data,
    });
    return survey;
  }
}
