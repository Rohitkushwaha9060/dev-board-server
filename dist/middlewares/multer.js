"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const services_1 = require("../services");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        file.originalname =
            String(services_1.utilsService.generateOTP()) +
                '.' +
                file.mimetype.split('/')[1];
        cb(null, 'public/temp');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
exports.multerMiddleware = (0, multer_1.default)({ storage });
//# sourceMappingURL=multer.js.map