import { Router } from 'express';
import { authController } from '@/controllers';
import { errorHandler } from '@/errors';
import {
    jwtMiddleware,
    multerMiddleware,
    tokenMiddleware,
} from '@/middlewares';

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

// get profile
router.get(
    '/profile',
    errorHandler(jwtMiddleware),
    errorHandler(authController.getUser)
);

// refresh token
router.post(
    '/refresh-token',
    errorHandler(tokenMiddleware),
    errorHandler(authController.refreshToken)
);

// forget password
router.post('/forget-password', errorHandler(authController.forgetPassword));

// reset password
router.post(
    '/reset-password',
    errorHandler(tokenMiddleware),
    errorHandler(authController.resetPassword)
);

// change password
router.post(
    '/change-password',
    errorHandler(jwtMiddleware),
    errorHandler(authController.changePassword)
);

// upload avatar
router.post(
    '/avatar',
    errorHandler(jwtMiddleware),
    errorHandler(multerMiddleware.single('avatar')),
    errorHandler(authController.uploadAvatar)
);

export { router as authRoutes };
