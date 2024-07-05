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
    .route('/:questionId/like')
    .post((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.toggleQuestionLike));
router
    .route('/:questionId/answers')
    .post((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.addAnswer))
    .get((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.getAnswers));
router
    .route('/:questionId/answers/author')
    .get((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.getAnswersByAuthor));
router
    .route('/answers/:answerId')
    .patch((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.updateAnswer))
    .get((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.getAnswerById))
    .delete((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.deleteAnswer));
router
    .route('/answers/:answerId/like')
    .post((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.qaController.toggleAnswerLike));
//# sourceMappingURL=qa.js.map