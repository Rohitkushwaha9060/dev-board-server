"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qaRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const errors_1 = require("../errors");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
exports.qaRoutes = router;
router
    .route('/')
    .post((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.createQuestion))
    .get((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.getAllQuestions));
router
    .route('/author')
    .get((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.getAllQuestionsByAuthor));
router
    .route('/:questionId')
    .patch((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.updateQuestion))
    .delete((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.deleteQuestion))
    .get((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.getQuestionById));
router
    .route('/:questionId/answers')
    .post((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.addAnswer));
//# sourceMappingURL=qa.js.map