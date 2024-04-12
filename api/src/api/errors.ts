
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
