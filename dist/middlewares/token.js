"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMiddleware = void 0;
const errors_1 = require("../errors");
const tokenMiddleware = (req, res, next) => {
    var _a;
    const token = req.cookies['token'] ||
        req.cookies['refreshToken'] ||
        ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) ||
        null;
    if (!token) {
        return next(new errors_1.HttpError('No token provided', 401));
    }
    req.token = token;
    return next();
};
exports.tokenMiddleware = tokenMiddleware;
//# sourceMappingURL=token.js.map