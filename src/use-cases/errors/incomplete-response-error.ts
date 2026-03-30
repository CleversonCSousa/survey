export class IncompleteResponseError extends Error {
  constructor() {
    super("Incomplete Response.");
  }
}
