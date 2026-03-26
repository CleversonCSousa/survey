import { Prisma } from "@prisma/client";
import { UsersRepository } from "./users-repository.ts";
import { prismaClient } from "@/lib/prisma/prismaClient.ts";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }
  async findByEmail(email: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prismaClient.user.create({ data });
    return user;
  }
}
