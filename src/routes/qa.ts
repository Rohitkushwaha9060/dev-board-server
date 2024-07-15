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
    .get(errorHandler(qaController.getAllQuestions));

router
    .route('/author')
    .get(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.getAllQuestionsByAuthor)
    );

router
    .route('/:questionId')
    .get(errorHandler(qaController.getQuestionById))
    .patch(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.updateQuestion)
    )
    .delete(
        errorHandler(jwtMiddleware),
        errorHandler(qaController.deleteQuestion)
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

router
    .route('/top/questions')
    .get(errorHandler(jwtMiddleware), errorHandler(qaController.topQuestions));

router
    .route('/author/:id')
    .get(errorHandler(qaController.getAllQuestionsByAuthorId));

export { router as qaRoutes };
