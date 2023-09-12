export class BaseError extends Error {
  constructor(message: string, public code: 400 | 404) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 404);
  }
}
