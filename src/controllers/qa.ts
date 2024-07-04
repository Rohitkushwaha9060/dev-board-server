import { qaService } from '@/services';
import { answerSchema, questionSchema } from '@/core';
import { HttpError } from '@/errors';
import { Request, Response, NextFunction } from 'express';

class QAController {
    // create a question
    async createQuestion(req: Request, res: Response, next: NextFunction) {
        const { data, error } = questionSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400));
        }

        const response = await qaService.createQuestion({
            question: data.question,
            tags: data.tags,
            author: req.user?.id!,
        });

        if (response.statusCode === 201) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // update a question
    async updateQuestion(req: Request, res: Response, next: NextFunction) {
        if (!req.params.questionId) {
            return next(new HttpError('Question id is required', 400));
        }

        const { data, error } = questionSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400));
        }

        const response = await qaService.updateQuestion({
            questionId: req.params.questionId,
            question: data.question,
            tags: data.tags,
        });

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // delete a question
    async deleteQuestion(req: Request, res: Response, next: NextFunction) {
        if (!req.params.questionId) {
            return next(new HttpError('Question id is required', 400));
        }

        const response = await qaService.deleteQuestion(
            req.params.questionId,
            req.user?.id!
        );

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // get all questions
    async getAllQuestions(req: Request, res: Response, next: NextFunction) {
        const response = await qaService.getAllQuestions();

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // get all questions by author
    async getAllQuestionsByAuthor(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const response = await qaService.getAllQuestionsByAuthor(req.user?.id!);
        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // get question by id
    async getQuestionById(req: Request, res: Response, next: NextFunction) {
        if (!req.params.questionId) {
            return next(new HttpError('Question id is required', 400));
        }

        const response = await qaService.getQuestionById(req.params.questionId);

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // add answer
    async addAnswer(req: Request, res: Response, next: NextFunction) {
        if (!req.params.questionId) {
            return next(new HttpError('Question id is required', 400));
        }

        const { data, error } = answerSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400));
        }

        const response = await qaService.addAnswer({
            questionId: req.params.questionId,
            answer: data.answer,
            userId: req.user?.id!,
        });

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }
}

export const qaController = new QAController();
