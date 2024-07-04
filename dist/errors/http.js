"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message, statusCode, error) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.status = statusCode < 500 ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=http.js.map