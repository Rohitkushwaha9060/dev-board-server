import { QAModel, AnswerModel } from '@/model';

class QAService {
    // create a question
    async createQuestion(data: {
        question: string;
        tags: Array<string>;
        author: string;
    }) {
        const qa = await new QAModel({
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

        const updatedQuestion = await QAModel.findOneAndUpdate(
            { _id: data.questionId },
            { question: data.question, tags: data.tags },
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
    async getAllQuestions() {
        const questions = await QAModel.find({ isPublic: true }).populate({
            path: 'tags',
            select: {
                name: 1,
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
            data: questions,
        };
    }

    // get all questions by author
    async getAllQuestionsByAuthor(userId: string) {
        const questions = await QAModel.find({ author: userId }).populate({
            path: 'tags',
            select: {
                name: 1,
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
            data: questions,
        };
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
            statusCode: 200,
            message: 'Answer added',
            data: newAnswer,
        };
    }
}

export const qaService = new QAService();
