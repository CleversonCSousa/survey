export class SurveyNotOpenError extends Error {
  constructor() {
    super("Survey not open.");
  }
}
