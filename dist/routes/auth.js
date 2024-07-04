"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const errors_1 = require("../errors");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
exports.authRoutes = router;
// sign up
router.post('/signup', (0, errors_1.errorHandler)(controllers_1.authController.signUp));
// send verification mail
router.post('/send-verification-mail', (0, errors_1.errorHandler)(controllers_1.authController.sendVerificationMail));
// verify email
router.post('/verify-email', (0, errors_1.errorHandler)(middlewares_1.tokenMiddleware), (0, errors_1.errorHandler)(controllers_1.authController.verifyEmail));
// sign in
router.post('/signin', (0, errors_1.errorHandler)(controllers_1.authController.signin));
// sign out
router.post('/signout', (0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.authController.signout));
// get profile
router.get('/profile', (0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.authController.getUser));
// refresh token
router.post('/refresh-token', (0, errors_1.errorHandler)(middlewares_1.tokenMiddleware), (0, errors_1.errorHandler)(controllers_1.authController.refreshToken));
// forget password
router.post('/forget-password', (0, errors_1.errorHandler)(controllers_1.authController.forgetPassword));
// reset password
router.post('/reset-password', (0, errors_1.errorHandler)(middlewares_1.tokenMiddleware), (0, errors_1.errorHandler)(controllers_1.authController.resetPassword));
// change password
router.post('/change-password', (0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.authController.changePassword));
// upload avatar
router.post('/avatar', (0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(middlewares_1.multerMiddleware.single('avatar')), (0, errors_1.errorHandler)(controllers_1.authController.uploadAvatar));
//# sourceMappingURL=auth.js.map