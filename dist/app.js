"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// file imports
const core_1 = require("./core");
const routes_1 = require("./routes");
// app
const app = (0, express_1.default)();
// app configuration
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(express_1.default.static('public'));
app.use(core_1.logger.httpExpress);
// middleware
app.use((0, cors_1.default)({
    origin: [
        'https://dev-board-server.onrender.com',
        'http://localhost:3000',
    ],
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 204,
}));
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
// app routes
app.use('/api/v1/auth', routes_1.authRoutes);
app.use('/api/v1/tags', routes_1.tagRoutes);
app.use('/api/v1/categories', routes_1.categoryRoutes);
app.use('/api/v1/blogs', routes_1.blogRoutes);
app.use('/api/v1/qas', routes_1.qaRoutes);
app.use('/api/v1/users', routes_1.userRoutes);
// app routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World! updated' });
});
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// export app
exports.default = app;
//# sourceMappingURL=app.js.map