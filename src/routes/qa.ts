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
    .route('/:questionId/like')
    .post(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.toggleQuestionLike)
    );

router
    .route('/:questionId/answers')
    .post(errorHandler(jwtMiddleware), errorHandler(qaController.addAnswer))
    .get(errorHandler(jwtMiddleware), errorHandler(qaController.getAnswers));

router
    .route('/:questionId/answers/author')
    .get(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.getAnswersByAuthor)
    );

router
    .route('/answers/:answerId')
    .patch(errorHandler(jwtMiddleware), errorHandler(qaController.updateAnswer))
    .get(errorHandler(jwtMiddleware), errorHandler(qaController.getAnswerById))
    .delete(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.deleteAnswer)
    );

router
    .route('/answers/:answerId/like')
    .post(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.toggleAnswerLike)
    );

export { router as qaRoutes };
