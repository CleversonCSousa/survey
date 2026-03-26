import { User, Prisma } from "@prisma/client";
import { UsersRepository } from "./users-repository.ts";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role ?? "RESPONDENT",
      createdAt: new Date(),
    };

    this.items.push(user);

    return user;
  }
}
