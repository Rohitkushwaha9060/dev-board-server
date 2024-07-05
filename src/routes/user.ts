import { Router } from 'express';
import { userController } from '@/controllers';
import { errorHandler } from '@/errors';
import {
    jwtMiddleware,
    multerMiddleware,
    tokenMiddleware,
} from '@/middlewares';

const router = Router();

router
    .route('/avatar')
    .post(
        errorHandler(jwtMiddleware),
        errorHandler(multerMiddleware.single('avatar')),
        errorHandler(userController.uploadAvatar)
    );

router
    .route('/profile')
    .delete(
        errorHandler(jwtMiddleware),
        errorHandler(userController.deleteProfile)
    );

export { router as userRoutes };
