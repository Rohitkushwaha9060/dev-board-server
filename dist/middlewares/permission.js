"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissionMiddleware = void 0;
const errors_1 = require("../errors");
const checkPermissionMiddleware = (req, res, next) => {
    if (!req.user) {
        return next(new errors_1.HttpError('Unauthorized', 401));
    }
    if (req.user.role !== 'admin') {
        return next(new errors_1.HttpError('Access denied', 401));
    }
    return next();
};
exports.checkPermissionMiddleware = checkPermissionMiddleware;
//# sourceMappingURL=permission.js.map