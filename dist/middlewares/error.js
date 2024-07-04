"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const core_1 = require("../core");
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status;
    const message = err.message || 'Internal Server Error';
    const error = err.error || null;
    if (core_1.secrets.NODE_ENV === 'production') {
        return res.status(statusCode).json({ statusCode, message, status });
    }
    return res.status(statusCode).json({ statusCode, message, status, error });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=error.js.map