"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socketIO = __importStar(require("socket.io"));
// file imports
const app_1 = __importDefault(require("./app"));
const core_1 = require("./core");
const middlewares_1 = require("./middlewares");
// server
const server = http_1.default.createServer(app_1.default);
// socket.io initialization
const io = new socketIO.Server(server, {
    cors: {
        origin: [core_1.secrets.ALLOW_ORIGIN_ONE],
        optionsSuccessStatus: 204,
        preflightContinue: true,
    },
});
// set up socket.io
io.on('connection', (socket) => {
    core_1.logger.info('A user connected ' + socket.id);
    socket.on('disconnect', () => {
        core_1.logger.info('A user disconnected ' + socket.id);
    });
});
// database connection
(0, core_1.connectDB)();
// set io in app
app_1.default.set('socket', io);
// global error handler
app_1.default.use(middlewares_1.globalErrorHandler);
// listen server
server.listen(core_1.secrets.PORT, () => {
    core_1.logger.info(`Server is running on port ${core_1.secrets.PORT}`);
});
//# sourceMappingURL=server.js.map