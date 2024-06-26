
export class AuthenticationError extends Error {
  public code = 401;
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  public code = 403;
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class RequestError extends Error {
  public code = 400;
  constructor(message: string) {
    super(message);
    this.name = 'RequestError';
  }
}

export class NotFoundError extends Error {
  public code = 404;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
