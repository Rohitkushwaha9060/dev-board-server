"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.redis = void 0;
const core_1 = require("../core");
const ioredis_1 = __importDefault(require("ioredis"));
const mongoose_1 = __importDefault(require("mongoose"));
const redis = new ioredis_1.default(core_1.secrets.REDIS_URL);
exports.redis = redis;
redis.on('error', (err) => {
    core_1.logger.error('redis error');
});
redis.on('connect', () => {
    core_1.logger.info('redis connected');
});
redis.on('reconnecting', () => {
    core_1.logger.info('redis reconnecting');
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mongoose_1.default.connect(core_1.secrets.DATABASE_URL);
        core_1.logger.info(`connection successfully ${connection.connection.host}`);
    }
    catch (error) {
        core_1.logger.error(`mongodb connection failed`);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map