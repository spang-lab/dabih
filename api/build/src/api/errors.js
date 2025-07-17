export class AuthenticationError extends Error {
    code = 401;
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
    }
}
export class AuthorizationError extends Error {
    code = 403;
    constructor(message) {
        super(message);
        this.name = 'AuthorizationError';
    }
}
export class RequestError extends Error {
    code = 400;
    constructor(message) {
        super(message);
        this.name = 'RequestError';
    }
}
export class NotFoundError extends Error {
    code = 404;
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}
//# sourceMappingURL=errors.js.map