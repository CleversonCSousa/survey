import { UsersRepository } from "@/repositories/users-repository.ts";
import { AuthenticateUseCase } from "./authenticate.ts";
import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error.ts";

let usersRepository: UsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    const createdUser = await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: await bcrypt.hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.id).toEqual(createdUser.id);
    expect(user.name).toEqual("John Doe");
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: await bcrypt.hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "111111",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
