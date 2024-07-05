"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const errors_1 = require("../errors");
const core_1 = require("../core");
const services_1 = require("../services");
class AuthController {
    // sign up
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // data validation
            const { data, error } = core_1.signUpSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.authService.signUp(data.name, data.email, data.phone, data.password);
            if (response.statusCode === 201) {
                res.cookie('token', (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 1,
                    sameSite: 'none',
                    secure: true,
                });
                return res.status(201).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // send verification mail
    sendVerificationMail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { data, error } = core_1.emailSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.authService.sendVerificationMail(data === null || data === void 0 ? void 0 : data.email);
            if (response.statusCode === 200) {
                res.cookie('token', (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 1,
                    sameSite: 'none',
                    secure: true,
                });
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // verify email
    verifyEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = core_1.otpSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const token = req.token;
            if (!token) {
                return next(new errors_1.HttpError('Token is required', 400));
            }
            const response = yield services_1.authService.verifyEmail(token, data.otp);
            if (response.statusCode === 200) {
                res.cookie('token', null, {
                    httpOnly: true,
                    maxAge: 1000,
                    sameSite: 'none',
                    secure: true,
                });
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // sign in
    signin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { data, error } = core_1.signInSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            // response
            const response = yield services_1.authService.signIn(data.email, data.password);
            if (response.statusCode === 200) {
                res.cookie('accessToken', (_a = response.data) === null || _a === void 0 ? void 0 : _a.accessToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 1,
                    sameSite: 'none',
                    secure: true,
                });
                res.cookie('refreshToken', (_b = response.data) === null || _b === void 0 ? void 0 : _b.refreshToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    sameSite: 'none',
                    secure: true,
                });
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // get user
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield services_1.authService.getUser((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (response.statusCode === 200) {
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // sign out
    signout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield services_1.authService.signOut((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (response.statusCode === 200) {
                res.cookie('accessToken', null, {
                    httpOnly: true,
                    maxAge: 60,
                    sameSite: 'none',
                    secure: true,
                });
                res.cookie('refreshToken', null, {
                    httpOnly: true,
                    maxAge: 60,
                    sameSite: 'none',
                    secure: true,
                });
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // refresh token
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const response = yield services_1.authService.refreshToken(req === null || req === void 0 ? void 0 : req.token);
            if (response.statusCode === 200) {
                res.cookie('accessToken', (_a = response.data) === null || _a === void 0 ? void 0 : _a.accessToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 1,
                    sameSite: 'none',
                    secure: true,
                });
                res.cookie('refreshToken', (_b = response.data) === null || _b === void 0 ? void 0 : _b.refreshToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 1,
                    sameSite: 'none',
                    secure: true,
                });
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // forget password
    forgetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { data, error } = core_1.emailSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.authService.forgetPassword(data === null || data === void 0 ? void 0 : data.email);
            if (response.statusCode === 200) {
                res.cookie('token', (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 1,
                    sameSite: 'none',
                    secure: true,
                });
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.data,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // reset password
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = core_1.resetPasswordSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const token = req.token;
            if (!token) {
                return next(new errors_1.HttpError('Token is required', 400));
            }
            const response = yield services_1.authService.resetPassword(token, data.otp, data.password);
            if (response.statusCode === 200) {
                res.cookie('token', null, {
                    httpOnly: true,
                    maxAge: 1000,
                    sameSite: 'none',
                    secure: true,
                });
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // change password
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { data, error } = core_1.changePasswordSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.authService.changePassword((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id, data.password);
            if (response.statusCode === 200) {
                res.cookie('accessToken', null, {
                    httpOnly: true,
                    maxAge: 1000,
                    sameSite: 'none',
                    secure: true,
                });
                res.cookie('refreshToken', null, {
                    httpOnly: true,
                    maxAge: 1000,
                    sameSite: 'none',
                    secure: true,
                });
                return res.status(200).json({
                    statusCode: response.statusCode,
                    message: response.message,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
}
exports.authController = new AuthController();
//# sourceMappingURL=auth.js.map