"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger_1 = require("@rohit2005/logger");
const secrets_1 = require("./secrets");
exports.logger = new logger_1.Logger({
    logFiles: secrets_1.secrets.NODE_ENV === 'production' ? true : false,
});
//# sourceMappingURL=logger.js.map