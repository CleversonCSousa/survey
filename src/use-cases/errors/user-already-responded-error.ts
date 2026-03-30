export class UserAlreadyRespondedError extends Error {
  constructor() {
    super("User already responded.");
  }
}
