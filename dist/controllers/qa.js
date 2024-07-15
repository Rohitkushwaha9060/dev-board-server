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
Object.defineProperty(exports, "__esModule", { value: true });
exports.qaController = void 0;
const services_1 = require("../services");
const core_1 = require("../core");
const errors_1 = require("../errors");
class QAController {
    // create a question
    createQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { data, error } = core_1.questionSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400));
            }
            const response = yield services_1.qaService.createQuestion({
                question: data.question,
                tags: data.tags,
                author: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                title: data.title,
            });
            if (response.statusCode === 201) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // update a question
    updateQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.questionId) {
                return next(new errors_1.HttpError('Question id is required', 400));
            }
            const { data, error } = core_1.questionSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400));
            }
            const response = yield services_1.qaService.updateQuestion({
                questionId: req.params.questionId,
                question: data.question,
                tags: data.tags,
                title: data.title,
            });
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // delete a question
    deleteQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.params.questionId) {
                return next(new errors_1.HttpError('Question id is required', 400));
            }
            const response = yield services_1.qaService.deleteQuestion(req.params.questionId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // get all questions
    getAllQuestions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.qaService.getAllQuestions(req.query);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // get all questions by author
    getAllQuestionsByAuthor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield services_1.qaService.getAllQuestionsByAuthor((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.query);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // get all questions by author id
    getAllQuestionsByAuthorId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.qaService.getAllQuestionsByAuthorId(req.params.id, req.query);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // get question by id
    getQuestionById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.questionId) {
                return next(new errors_1.HttpError('Question id is required', 400));
            }
            const response = yield services_1.qaService.getQuestionById(req.params.questionId);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // toggle question like
    toggleQuestionLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.params.questionId) {
                return next(new errors_1.HttpError('Question id is required', 400));
            }
            const response = yield services_1.qaService.toggleQuestionLike(req.params.questionId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // top questions
    topQuestions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.qaService.topQuestions(req.query);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // add answer
    addAnswer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.params.questionId) {
                return next(new errors_1.HttpError('Question id is required', 400));
            }
            const { data, error } = core_1.answerSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400));
            }
            const response = yield services_1.qaService.addAnswer({
                questionId: req.params.questionId,
                answer: data.answer,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            });
            if (response.statusCode === 201) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // update answer
    updateAnswer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.params.answerId) {
                return next(new errors_1.HttpError('Answer id is required', 400));
            }
            const { data, error } = core_1.answerSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400));
            }
            const response = yield services_1.qaService.updateAnswer({
                answerId: req.params.answerId,
                answer: data.answer,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            });
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // delete answer
    deleteAnswer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.params.answerId) {
                return next(new errors_1.HttpError('Answer id is required', 400));
            }
            const response = yield services_1.qaService.deleteAnswer(req.params.answerId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // get answers
    getAnswers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.questionId) {
                return next(new errors_1.HttpError('Question id is required', 400));
            }
            const response = yield services_1.qaService.getAnswers(req.params.questionId, req.query);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // get answers by author
    getAnswersByAuthor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield services_1.qaService.getAnswersByAuthor((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.params.questionId, req.query);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // get answer by id
    getAnswerById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.answerId) {
                return next(new errors_1.HttpError('Answer id is required', 400));
            }
            const response = yield services_1.qaService.getAnswerById(req.params.answerId);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // toggle answer like
    toggleAnswerLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.params.answerId) {
                return next(new errors_1.HttpError('Answer id is required', 400));
            }
            const response = yield services_1.qaService.toggleAnswerLike(req.params.answerId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
}
exports.qaController = new QAController();
//# sourceMappingURL=qa.js.map