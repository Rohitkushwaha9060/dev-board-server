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
exports.qaService = void 0;
const model_1 = require("../model");
const utils_1 = require("./utils");
class QAService {
    // create a question
    createQuestion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // slug for url
            const slug = utils_1.utilsService.slugifyData(data.title);
            const qa = yield new model_1.QAModel({
                title: data.title,
                slug: slug,
                question: data.question,
                tags: data.tags,
                author: data.author,
            });
            // save the question
            yield qa.save();
            return { statusCode: 201, message: 'Question created', data: qa };
        });
    }
    // update a question
    updateQuestion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const qa = yield model_1.QAModel.findById(data.questionId);
            if (!qa) {
                return {
                    statusCode: 404,
                    message: 'Question not found',
                };
            }
            const slug = yield utils_1.utilsService.slugifyData(data.title);
            const updatedQuestion = yield model_1.QAModel.findOneAndUpdate({ _id: data.questionId }, {
                title: data.title,
                question: data.question,
                tags: data.tags,
                slug: slug,
            }, { new: true });
            return {
                statusCode: 200,
                message: 'Question updated',
                data: updatedQuestion,
            };
        });
    }
    // delete a question
    deleteQuestion(questionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const qa = yield model_1.QAModel.findById(questionId);
            if (!qa) {
                return {
                    statusCode: 404,
                    message: 'Question not found',
                };
            }
            // check if user is the author
            if (((_a = qa.author) === null || _a === void 0 ? void 0 : _a._id) != userId) {
                return {
                    statusCode: 400,
                    message: 'Access denied',
                };
            }
            yield model_1.QAModel.deleteOne({ _id: questionId });
            return {
                statusCode: 200,
                message: 'Question deleted',
            };
        });
    }
    // get all questions
    getAllQuestions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.func == 'true') {
                const page = query.page ? parseInt(query.page) : 1;
                const limit = query.limit ? parseInt(query.limit) : 10;
                const skip = (page - 1) * limit;
                const sort = query.sort ? query.sort : '-createdAt';
                const totalQuestions = yield model_1.QAModel.countDocuments({
                    isPublic: true,
                });
                const questions = yield model_1.QAModel.find({ isPublic: true })
                    .sort(sort)
                    .skip(skip)
                    .limit(limit);
                if (questions.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Questions not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'Questions found',
                    data: {
                        questions: questions,
                        prevPage: page - 1 > 0 ? page - 1 : null,
                        currentPage: page,
                        nextPage: page + 1 <= Math.ceil(totalQuestions / limit)
                            ? page + 1
                            : null,
                        totalQuestions: totalQuestions,
                        totalPages: Math.ceil(totalQuestions / limit),
                    },
                };
            }
            else {
                const questions = yield model_1.QAModel.find({ isPublic: true })
                    .populate({
                    path: 'tags',
                    select: {
                        name: 1,
                    },
                })
                    .populate({
                    path: 'author',
                    select: {
                        name: 1,
                        email: 1,
                        avatar: 1,
                    },
                });
                if (questions.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Questions not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'Questions found',
                    data: {
                        questions: questions,
                        totalQuestions: questions.length,
                    },
                };
            }
        });
    }
    // get all questions by author
    getAllQuestionsByAuthor(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.func == 'true') {
                const page = query.page ? parseInt(query.page) : 1;
                const limit = query.limit ? parseInt(query.limit) : 10;
                const skip = (page - 1) * limit;
                const sort = query.sort ? query.sort : '-createdAt';
                const totalQuestions = yield model_1.QAModel.countDocuments({
                    author: userId,
                });
                const questions = yield model_1.QAModel.find({ author: userId })
                    .sort(sort)
                    .skip(skip)
                    .limit(limit);
                if (questions.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Questions not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'Questions found',
                    data: {
                        questions: questions,
                        prevPage: page - 1 > 0 ? page - 1 : null,
                        currentPage: page,
                        nextPage: page + 1 <= Math.ceil(totalQuestions / limit)
                            ? page + 1
                            : null,
                        totalQuestions: totalQuestions,
                        totalPages: Math.ceil(totalQuestions / limit),
                    },
                };
            }
            else {
                const questions = yield model_1.QAModel.find({ author: userId })
                    .populate({
                    path: 'tags',
                    select: {
                        name: 1,
                    },
                })
                    .populate({
                    path: 'author',
                    select: {
                        name: 1,
                        email: 1,
                        avatar: 1,
                    },
                });
                if (questions.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Questions not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'Questions found',
                    data: {
                        questions: questions,
                        totalQuestions: questions.length,
                    },
                };
            }
        });
    }
    // get question by id
    getQuestionById(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const question = yield model_1.QAModel.findOne({
                    _id: questionId,
                })
                    .populate({
                    path: 'tags',
                    select: {
                        name: 1,
                    },
                })
                    .populate({
                    path: 'answers',
                    select: {
                        answer: 1,
                    },
                    populate: {
                        path: 'author',
                        select: {
                            name: 1,
                            email: 1,
                            avatar: 1,
                        },
                    },
                })
                    .populate({
                    path: 'author',
                    select: {
                        name: 1,
                        email: 1,
                        avatar: 1,
                    },
                });
                return {
                    statusCode: 200,
                    message: 'Question found',
                    data: question,
                };
            }
            catch (error) {
                return {
                    statusCode: 404,
                    message: 'Question not found',
                };
            }
        });
    }
    // toggle question like
    toggleQuestionLike(questionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield model_1.QAModel.findById(questionId);
            if (!question) {
                return {
                    statusCode: 404,
                    message: 'Question not found',
                };
            }
            if (question.likes.includes(userId)) {
                yield model_1.QAModel.updateOne({ _id: questionId }, { $pull: { likes: userId } });
                return {
                    statusCode: 200,
                    message: 'Question liked Reverted',
                };
            }
            else {
                yield model_1.QAModel.updateOne({ _id: questionId }, { $push: { likes: userId } });
                return {
                    statusCode: 200,
                    message: 'Question liked',
                };
            }
        });
    }
    // top questions
    topQuestions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const topQuestions = yield model_1.QAModel.aggregate([
                {
                    $addFields: {
                        totalInteractions: {
                            $add: [{ $size: '$likes' }, { $size: '$answers' }],
                        },
                    },
                },
                {
                    $sort: { totalInteractions: -1 },
                },
                {
                    $limit: 10,
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author',
                    },
                },
                {
                    $lookup: {
                        from: 'tags',
                        localField: 'tags',
                        foreignField: '_id',
                        as: 'tags',
                    },
                },
                {
                    $project: {
                        title: 1,
                        content: 1,
                        likes: 1,
                        answers: 1,
                        author: {
                            _id: 1,
                            name: 1,
                            email: 1,
                        },
                        tags: {
                            name: 1,
                        },
                        categories: 1,
                        totalInteractions: 1,
                    },
                },
            ]);
            if (topQuestions.length === 0) {
                return {
                    statusCode: 404,
                    message: 'Top Questions not found',
                };
            }
            return {
                statusCode: 200,
                message: 'Top Questions found',
                data: topQuestions,
            };
        });
    }
    // add answer
    addAnswer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield model_1.QAModel.findById(data.questionId);
            if (!question) {
                return {
                    statusCode: 404,
                    message: 'Question not found',
                };
            }
            // add answer
            const newAnswer = yield new model_1.AnswerModel({
                answer: data.answer,
                questionId: data.questionId,
                author: data.userId,
            });
            // add answer
            yield model_1.QAModel.updateOne({ _id: data.questionId }, { $push: { answers: newAnswer.id } });
            // save answer
            yield newAnswer.save();
            return {
                statusCode: 201,
                message: 'Answer added',
                data: newAnswer,
            };
        });
    }
    // update answer
    updateAnswer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const answer = yield model_1.AnswerModel.findById(data.answerId);
            if (!answer) {
                return {
                    statusCode: 404,
                    message: 'Answer not found',
                };
            }
            // check if user is the author
            //@ts-ignore
            if (((_a = answer.author) === null || _a === void 0 ? void 0 : _a._id) != data.userId) {
                return {
                    statusCode: 400,
                    message: 'Access denied',
                };
            }
            const updatedAnswer = yield model_1.AnswerModel.findOneAndUpdate({ _id: data.answerId }, { answer: data.answer }, { new: true });
            return {
                statusCode: 200,
                message: 'Answer updated',
                data: updatedAnswer,
            };
        });
    }
    // delete answer
    deleteAnswer(answerId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const answer = yield model_1.AnswerModel.findById(answerId);
            if (!answer) {
                return {
                    statusCode: 404,
                    message: 'Answer not found',
                };
            }
            // check if user is the author
            //@ts-ignore
            if (((_a = answer.author) === null || _a === void 0 ? void 0 : _a._id) != userId) {
                return {
                    statusCode: 400,
                    message: 'Access denied',
                };
            }
            yield model_1.AnswerModel.deleteOne({ _id: answerId });
            return {
                statusCode: 200,
                message: 'Answer deleted',
            };
        });
    }
    // get answers
    getAnswers(questionId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.func == 'true') {
                const page = query.page ? parseInt(query.page) : 1;
                const limit = query.limit ? parseInt(query.limit) : 10;
                const skip = (page - 1) * limit;
                const sort = query.sort ? query.sort : '-createdAt';
                const totalAnswers = yield model_1.AnswerModel.countDocuments({
                    questionId: questionId,
                });
                const answers = yield model_1.AnswerModel.find({
                    questionId: questionId,
                })
                    .sort(sort)
                    .skip(skip)
                    .limit(limit);
                if (answers.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Answers not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'Answers found',
                    data: {
                        answers: answers,
                        prevPage: page - 1 > 0 ? page - 1 : null,
                        currentPage: page,
                        nextPage: page + 1 <= Math.ceil(totalAnswers / limit)
                            ? page + 1
                            : null,
                        totalAnswers: totalAnswers,
                        totalPages: Math.ceil(totalAnswers / limit),
                    },
                };
            }
            else {
                const answers = yield model_1.AnswerModel.find({
                    questionId: questionId,
                }).populate({
                    path: 'author',
                    select: {
                        name: 1,
                        email: 1,
                        avatar: 1,
                    },
                });
                if (answers.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Answers not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'Answers found',
                    data: {
                        answers: answers,
                        totalAnswers: answers.length,
                    },
                };
            }
        });
    }
    // get answers by author
    getAnswersByAuthor(userId, questionId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.func == 'true') {
                const page = query.page ? parseInt(query.page) : 1;
                const limit = query.limit ? parseInt(query.limit) : 10;
                const skip = (page - 1) * limit;
                const sort = query.sort ? query.sort : '-createdAt';
                const totalAnswers = yield model_1.AnswerModel.countDocuments({
                    author: userId,
                    questionId: questionId,
                });
                const answers = yield model_1.AnswerModel.find({
                    author: userId,
                    questionId: questionId,
                })
                    .sort(sort)
                    .skip(skip)
                    .limit(limit);
                if (answers.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Answers not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'Answers found',
                    data: {
                        answers: answers,
                        prevPage: page - 1 > 0 ? page - 1 : null,
                        currentPage: page,
                        nextPage: page + 1 <= Math.ceil(totalAnswers / limit)
                            ? page + 1
                            : null,
                        totalAnswers: totalAnswers,
                        totalPages: Math.ceil(totalAnswers / limit),
                    },
                };
            }
            else {
                const answers = yield model_1.AnswerModel.find({
                    author: userId,
                    questionId,
                })
                    .populate({
                    path: 'author',
                    select: {
                        name: 1,
                        email: 1,
                        avatar: 1,
                    },
                })
                    .populate({
                    path: 'question',
                    select: {
                        question: 1,
                    },
                });
                if (answers.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Answers not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'Answers found',
                    data: {
                        answers: answers,
                        totalAnswers: answers.length,
                    },
                };
            }
        });
    }
    // get answer by id
    getAnswerById(answerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const answer = yield model_1.AnswerModel.findOne({
                    _id: answerId,
                }).populate({
                    path: 'author',
                    select: {
                        name: 1,
                        email: 1,
                        avatar: 1,
                    },
                });
                return {
                    statusCode: 200,
                    message: 'Answer found',
                    data: answer,
                };
            }
            catch (error) {
                return {
                    statusCode: 404,
                    message: 'Answer not found',
                };
            }
        });
    }
    // toggle answer like
    toggleAnswerLike(answerId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const answer = yield model_1.AnswerModel.findById(answerId);
            if (!answer) {
                return {
                    statusCode: 404,
                    message: 'Answer not found',
                };
            }
            if (answer.likes.includes(userId)) {
                yield model_1.AnswerModel.updateOne({ _id: answerId }, { $pull: { likes: userId } });
                return {
                    statusCode: 200,
                    message: 'Answer liked Reverted',
                };
            }
            else {
                yield model_1.AnswerModel.updateOne({ _id: answerId }, { $push: { likes: userId } });
                return {
                    statusCode: 200,
                    message: 'Answer liked',
                };
            }
        });
    }
}
exports.qaService = new QAService();
//# sourceMappingURL=qa.js.map