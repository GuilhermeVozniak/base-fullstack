export class ForbiddenError extends Error {
  constructor() {
    super("Forbidden")
  }
}

export class NotFoundError extends Error {
  constructor() {
    super("Not Found")
  }
}
