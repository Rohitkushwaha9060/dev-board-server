import { Router } from 'express';
import { authController } from '@/controllers';
import { errorHandler } from '@/errors';
import { jwtMiddleware, tokenMiddleware } from '@/middlewares';

const router = Router();

// sign up
router.post('/signup', errorHandler(authController.signUp));

// send verification mail
router.post(
    '/send-verification-mail',
    errorHandler(authController.sendVerificationMail)
);

// verify email
router.post(
    '/verify-email',
    errorHandler(tokenMiddleware),
    errorHandler(authController.verifyEmail)
);

// sign in
router.post('/signin', errorHandler(authController.signin));

// sign out
router.post(
    '/signout',
    errorHandler(jwtMiddleware),
    errorHandler(authController.signout)
);

export { router as authRoutes };
