"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = void 0;
const core_1 = require("../core");
const errors_1 = require("../errors");
const services_1 = require("../services");
const jwtMiddleware = (req, res, next) => {
    var _a;
    const accessToken = req.cookies['accessToken'] ||
        ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) ||
        null;
    if (!accessToken) {
        return next(new errors_1.HttpError('No token provided', 401));
    }
    const decodedToken = services_1.utilsService.verifyTokenJwt(accessToken, core_1.secrets.ACCESS_TOKEN_SECRET);
    // check if token is valid
    if (!decodedToken) {
        return {
            statusCode: 401,
            message: 'Invalid token',
        };
    }
    req.user = {
        id: decodedToken.id,
        role: decodedToken.role,
    };
    return next();
};
exports.jwtMiddleware = jwtMiddleware;
//# sourceMappingURL=jwt.js.map