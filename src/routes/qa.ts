import { Router } from 'express';
import { qaController } from '@/controllers';
import { errorHandler } from '@/errors';
import { jwtMiddleware } from '@/middlewares';

const router = Router();

router
    .route('/')
    .post(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.createQuestion)
    )
    .get(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.getAllQuestions)
    );

router
    .route('/author')
    .get(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.getAllQuestionsByAuthor)
    );

router
    .route('/:questionId')
    .patch(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.updateQuestion)
    )
    .delete(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.deleteQuestion)
    )
    .get(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.getQuestionById)
    );

router
    .route('/:questionId/answers')
    .post(errorHandler(jwtMiddleware), errorHandler(qaController.addAnswer));

export { router as qaRoutes };
