import { QAModel, AnswerModel } from '@/model';
import { utilsService } from './utils';

class QAService {
    // create a question
    async createQuestion(data: {
        title: string;
        question: string;
        tags: Array<string>;
        author: string;
    }) {
        // slug for url
        const slug = utilsService.slugifyData(data.title);

        const qa = await new QAModel({
            title: data.title,
            slug: slug,
            question: data.question,
            tags: data.tags,
            author: data.author,
        });

        // save the question
        await qa.save();

        return { statusCode: 201, message: 'Question created', data: qa };
    }

    // update a question
    async updateQuestion(data: {
        questionId: string;
        title: string;
        question: string;
        tags: Array<string>;
    }) {
        const qa = await QAModel.findById(data.questionId);

        if (!qa) {
            return {
                statusCode: 404,
                message: 'Question not found',
            };
        }

        const slug = await utilsService.slugifyData(data.title);

        const updatedQuestion = await QAModel.findOneAndUpdate(
            { _id: data.questionId },
            {
                title: data.title,
                question: data.question,
                tags: data.tags,
                slug: slug,
            },
            { new: true }
        );

        return {
            statusCode: 200,
            message: 'Question updated',
            data: updatedQuestion,
        };
    }

    // delete a question
    async deleteQuestion(questionId: string, userId: any) {
        const qa = await QAModel.findById(questionId);

        if (!qa) {
            return {
                statusCode: 404,
                message: 'Question not found',
            };
        }
        // check if user is the author
        if (qa.author?._id != userId) {
            return {
                statusCode: 400,
                message: 'Access denied',
            };
        }

        await QAModel.deleteOne({ _id: questionId });

        return {
            statusCode: 200,
            message: 'Question deleted',
        };
    }

    // get all questions
    async getAllQuestions(query: any) {
        if (query.func == 'true') {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;
            const sort = query.sort ? query.sort : '-createdAt';

            const totalQuestions = await QAModel.countDocuments({
                isPublic: true,
            });

            const questions = await QAModel.find({ isPublic: true })
                .sort(sort)
                .skip(skip)
                .limit(limit)
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
                    prevPage: page - 1 > 0 ? page - 1 : null,
                    currentPage: page,
                    nextPage:
                        page + 1 <= Math.ceil(totalQuestions / limit)
                            ? page + 1
                            : null,
                    totalQuestions: totalQuestions,
                    totalPages: Math.ceil(totalQuestions / limit),
                },
            };
        } else {
            const questions = await QAModel.find({ isPublic: true })
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
    }

    // get all questions by author
    async getAllQuestionsByAuthor(userId: string, query: any) {
        if (query.func == 'true') {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;
            const sort = query.sort ? query.sort : '-createdAt';

            const totalQuestions = await QAModel.countDocuments({
                author: userId,
            });

            const questions = await QAModel.find({ author: userId })
                .sort(sort)
                .skip(skip)
                .limit(limit)
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
                    prevPage: page - 1 > 0 ? page - 1 : null,
                    currentPage: page,
                    nextPage:
                        page + 1 <= Math.ceil(totalQuestions / limit)
                            ? page + 1
                            : null,
                    totalQuestions: totalQuestions,
                    totalPages: Math.ceil(totalQuestions / limit),
                },
            };
        } else {
            const questions = await QAModel.find({ author: userId })
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
    }

    // get all questions by author id
    async getAllQuestionsByAuthorId(userId: string, query: any) {
        if (query.func == 'true') {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;
            const sort = query.sort ? query.sort : '-createdAt';

            const totalQuestions = await QAModel.countDocuments({
                isPublic: true,
                author: userId,
            });

            const questions = await QAModel.find({ author: userId })
                .sort(sort)
                .skip(skip)
                .limit(limit)
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
                    prevPage: page - 1 > 0 ? page - 1 : null,
                    currentPage: page,
                    nextPage:
                        page + 1 <= Math.ceil(totalQuestions / limit)
                            ? page + 1
                            : null,
                    totalQuestions: totalQuestions,
                    totalPages: Math.ceil(totalQuestions / limit),
                },
            };
        } else {
            const questions = await QAModel.find({ author: userId })
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
    }

    // get question by id
    async getQuestionById(questionId: string) {
        try {
            const question = await QAModel.findOne({
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
        } catch (error) {
            return {
                statusCode: 404,
                message: 'Question not found',
            };
        }
    }

    // toggle question like
    async toggleQuestionLike(questionId: string, userId: any) {
        const question = await QAModel.findById(questionId);

        if (!question) {
            return {
                statusCode: 404,
                message: 'Question not found',
            };
        }

        if (question.likes.includes(userId)) {
            await QAModel.updateOne(
                { _id: questionId },
                { $pull: { likes: userId } }
            );
            return {
                statusCode: 200,
                message: 'Question liked Reverted',
            };
        } else {
            await QAModel.updateOne(
                { _id: questionId },
                { $push: { likes: userId } }
            );
            return {
                statusCode: 200,
                message: 'Question liked',
            };
        }
    }

    // top questions
    async topQuestions(query: any) {
        const topQuestions = await QAModel.aggregate([
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
    }

    // add answer
    async addAnswer(data: {
        questionId: string;
        answer: string;
        userId: string;
    }) {
        const question = await QAModel.findById(data.questionId);

        if (!question) {
            return {
                statusCode: 404,
                message: 'Question not found',
            };
        }

        // add answer
        const newAnswer = await new AnswerModel({
            answer: data.answer,
            questionId: data.questionId,
            author: data.userId,
        });

        // add answer
        await QAModel.updateOne(
            { _id: data.questionId },
            { $push: { answers: newAnswer.id } }
        );

        // save answer
        await newAnswer.save();

        return {
            statusCode: 201,
            message: 'Answer added',
            data: newAnswer,
        };
    }

    // update answer
    async updateAnswer(data: {
        answerId: string;
        answer: string;
        userId: string;
    }) {
        const answer = await AnswerModel.findById(data.answerId);

        if (!answer) {
            return {
                statusCode: 404,
                message: 'Answer not found',
            };
        }

        // check if user is the author
        //@ts-ignore
        if (answer.author?._id != data.userId) {
            return {
                statusCode: 400,
                message: 'Access denied',
            };
        }

        const updatedAnswer = await AnswerModel.findOneAndUpdate(
            { _id: data.answerId },
            { answer: data.answer },
            { new: true }
        );

        return {
            statusCode: 200,
            message: 'Answer updated',
            data: updatedAnswer,
        };
    }

    // delete answer
    async deleteAnswer(answerId: string, userId: string) {
        const answer = await AnswerModel.findById(answerId);

        if (!answer) {
            return {
                statusCode: 404,
                message: 'Answer not found',
            };
        }

        // check if user is the author
        //@ts-ignore
        if (answer.author?._id != userId) {
            return {
                statusCode: 400,
                message: 'Access denied',
            };
        }

        await AnswerModel.deleteOne({ _id: answerId });

        return {
            statusCode: 200,
            message: 'Answer deleted',
        };
    }

    // get answers
    async getAnswers(questionId: string, query: any) {
        if (query.func == 'true') {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;
            const sort = query.sort ? query.sort : '-createdAt';

            const totalAnswers = await AnswerModel.countDocuments({
                questionId: questionId,
            });

            const answers = await AnswerModel.find({
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
                    nextPage:
                        page + 1 <= Math.ceil(totalAnswers / limit)
                            ? page + 1
                            : null,
                    totalAnswers: totalAnswers,
                    totalPages: Math.ceil(totalAnswers / limit),
                },
            };
        } else {
            const answers = await AnswerModel.find({
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
    }

    // get answers by author
    async getAnswersByAuthor(userId: string, questionId: string, query: any) {
        if (query.func == 'true') {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;
            const sort = query.sort ? query.sort : '-createdAt';

            const totalAnswers = await AnswerModel.countDocuments({
                author: userId,
                questionId: questionId,
            });

            const answers = await AnswerModel.find({
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
                    nextPage:
                        page + 1 <= Math.ceil(totalAnswers / limit)
                            ? page + 1
                            : null,
                    totalAnswers: totalAnswers,
                    totalPages: Math.ceil(totalAnswers / limit),
                },
            };
        } else {
            const answers = await AnswerModel.find({
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
    }

    // get answer by id
    async getAnswerById(answerId: string) {
        try {
            const answer = await AnswerModel.findOne({
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
        } catch (error) {
            return {
                statusCode: 404,
                message: 'Answer not found',
            };
        }
    }

    // toggle answer like
    async toggleAnswerLike(answerId: string, userId: any) {
        const answer = await AnswerModel.findById(answerId);

        if (!answer) {
            return {
                statusCode: 404,
                message: 'Answer not found',
            };
        }

        if (answer.likes.includes(userId)) {
            await AnswerModel.updateOne(
                { _id: answerId },
                { $pull: { likes: userId } }
            );
            return {
                statusCode: 200,
                message: 'Answer liked Reverted',
            };
        } else {
            await AnswerModel.updateOne(
                { _id: answerId },
                { $push: { likes: userId } }
            );
            return {
                statusCode: 200,
                message: 'Answer liked',
            };
        }
    }
}

export const qaService = new QAService();
