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
exports.authService = void 0;
const core_1 = require("../core");
const email_1 = require("./email");
const utils_1 = require("./utils");
const model_1 = require("../model");
class AuthService {
    // sign up
    signUp(name, email, phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if email is already in use
            const user = yield model_1.UserModel.findOne({ email });
            // check if email is already in use
            if (user) {
                return {
                    statusCode: 400,
                    message: 'Email already in use',
                    data: {
                        user,
                    },
                };
            }
            // hash password
            const hashedPassword = yield utils_1.utilsService.hashPasswordBcrypt(password);
            // otp verification
            const otp = String(yield utils_1.utilsService.generateOTP());
            // create user
            const newUser = yield model_1.UserModel.create({
                name,
                email,
                phone,
                password: hashedPassword,
                otp,
            });
            // generate token
            const token = yield utils_1.utilsService.createTokenJwt({
                name,
                email,
            }, core_1.secrets.ACCESS_TOKEN_SECRET, '1d');
            // update user
            yield model_1.UserModel.updateOne({ email }, { token });
            // send verification email
            yield email_1.emailService.sendVerificationEmail(email, otp);
            newUser.otp = '';
            // return response
            return {
                statusCode: 201,
                message: 'success',
                data: {
                    user: newUser,
                    token,
                },
            };
        });
    }
    // verification mail
    sendVerificationMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield model_1.UserModel.findOne({ email });
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                };
            }
            // already verified
            if (user.isVerified) {
                return {
                    statusCode: 400,
                    message: 'User already verified',
                };
            }
            // otp verification
            const otp = String(yield utils_1.utilsService.generateOTP());
            // generate token
            const token = yield utils_1.utilsService.createTokenJwt({
                email: user.email,
            }, core_1.secrets.ACCESS_TOKEN_SECRET, '1d');
            // update user
            yield model_1.UserModel.updateOne({ _id: user.id }, { otp, token });
            // send verification email
            yield email_1.emailService.sendVerificationEmail(email, otp);
            // return response
            return {
                statusCode: 200,
                message: 'success',
                data: {
                    token,
                },
            };
        });
    }
    // verify email
    verifyEmail(token, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if token is valid
            const decodedToken = yield utils_1.utilsService.verifyTokenJwt(token, core_1.secrets.ACCESS_TOKEN_SECRET);
            // check if token is valid
            if (!decodedToken) {
                return {
                    statusCode: 401,
                    message: 'Invalid token',
                };
            }
            // check if email is valid
            const user = yield model_1.UserModel.findOne({
                email: decodedToken.email,
                token,
            }).select('-password');
            // check if user exists
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                };
            }
            // check user already verified
            if (user.isVerified) {
                return {
                    statusCode: 400,
                    message: 'User already verified',
                };
            }
            // check if otp is valid
            if (user.otp !== otp) {
                return {
                    statusCode: 400,
                    message: 'OTP is invalid',
                };
            }
            // update user
            yield model_1.UserModel.updateOne({ _id: user.id }, { isVerified: true, otp: null, token: null });
            // return response
            return {
                statusCode: 200,
                message: 'success',
                data: {
                    user,
                },
            };
        });
    }
    // sign in
    signIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // find user
            const user = yield model_1.UserModel.findOne({ email });
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not fount',
                };
            }
            // check email is verified and approved
            if (!user.isVerified) {
                return {
                    statusCode: 401,
                    message: 'your email is not verified',
                };
            }
            // password validation
            const isMatch = yield utils_1.utilsService.comparePasswordBcrypt(password, user.password);
            if (!isMatch) {
                return {
                    statusCode: 401,
                    message: 'invalid credentials',
                };
            }
            // generate tokens
            const accessToken = yield utils_1.utilsService.createTokenJwt({
                id: user.id,
                role: user.role,
            }, core_1.secrets.ACCESS_TOKEN_SECRET, '1d');
            const refreshToken = yield utils_1.utilsService.createTokenJwt({
                id: user.id,
            }, core_1.secrets.REFRESH_TOKEN_SECRET, '7d');
            // set token in db
            yield model_1.UserModel.updateOne({ _id: user.id }, { token: refreshToken });
            return {
                statusCode: 200,
                message: 'sign in success',
                data: {
                    accessToken,
                    refreshToken,
                    user: {
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        avatar: {
                            url: (_a = user.avatar) === null || _a === void 0 ? void 0 : _a.url,
                        },
                    },
                },
            };
        });
    }
    // get user
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield model_1.UserModel.findOne({ _id: userId }).select('-password -otp -token -__v');
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                };
            }
            return {
                statusCode: 200,
                message: 'success',
                data: {
                    user: user,
                },
            };
        });
    }
    // sign out
    signOut(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield model_1.UserModel.updateOne({ id: userId }, { token: null });
            return {
                statusCode: 200,
                message: 'sign out success',
            };
        });
    }
    // refresh token
    refreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if token is valid
            const decodedToken = yield utils_1.utilsService.verifyTokenJwt(token, core_1.secrets.REFRESH_TOKEN_SECRET);
            // check if token is valid
            if (!decodedToken) {
                return {
                    statusCode: 401,
                    message: 'Invalid token',
                };
            }
            // find user
            const user = yield model_1.UserModel.findOne({ _id: decodedToken.id });
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not fount',
                };
            }
            // generate tokens
            const accessToken = yield utils_1.utilsService.createTokenJwt({
                id: user.id,
                role: user.role,
            }, core_1.secrets.ACCESS_TOKEN_SECRET, '1d');
            const refreshToken = yield utils_1.utilsService.createTokenJwt({
                id: user.id,
            }, core_1.secrets.REFRESH_TOKEN_SECRET, '7d');
            // set token in db
            yield model_1.UserModel.updateOne({ id: user.id }, { token: refreshToken });
            return {
                statusCode: 200,
                message: 'token refreshed',
                data: {
                    accessToken,
                    refreshToken,
                },
            };
        });
    }
    // forget password
    forgetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // find user
            const user = yield model_1.UserModel.findOne({ email });
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not fount',
                };
            }
            // check email is verified and approved
            if (!user.isVerified) {
                return {
                    statusCode: 401,
                    message: 'your email is not verified',
                };
            }
            // generate otp
            const otp = String(yield utils_1.utilsService.generateOTP());
            // generate token
            const token = yield utils_1.utilsService.createTokenJwt({
                email: user.email,
            }, core_1.secrets.ACCESS_TOKEN_SECRET, '1d');
            // update user
            yield model_1.UserModel.updateOne({ email }, { otp, token });
            // send verification email
            yield email_1.emailService.sendVerificationEmail(email, otp);
            return {
                statusCode: 200,
                message: 'success',
                data: {
                    token,
                },
            };
        });
    }
    // reset password
    resetPassword(token, otp, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if token is valid
            const decodedToken = yield utils_1.utilsService.verifyTokenJwt(token, core_1.secrets.ACCESS_TOKEN_SECRET);
            // check if token is valid
            if (!decodedToken) {
                return {
                    statusCode: 401,
                    message: 'Invalid token',
                };
            }
            // check if email is valid
            const user = yield model_1.UserModel.findOne({
                email: decodedToken.email,
                token,
            });
            // check if user exists
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                };
            }
            // check if otp is valid
            if (user.otp !== otp) {
                return {
                    statusCode: 400,
                    message: 'OTP is invalid',
                };
            }
            // hash password
            const hashedPassword = yield utils_1.utilsService.hashPasswordBcrypt(password);
            // update user
            yield model_1.UserModel.updateOne({ _id: user.id }, { password: hashedPassword, token: null, otp: null });
            return {
                statusCode: 200,
                message: 'success',
            };
        });
    }
    // change password
    changePassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // find user
            const user = yield model_1.UserModel.findOne({ _id: userId });
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                };
            }
            // hash password
            const hashedPassword = yield utils_1.utilsService.hashPasswordBcrypt(password);
            // update user
            yield model_1.UserModel.updateOne({ _id: user.id }, { password: hashedPassword });
            return {
                statusCode: 200,
                message: 'password changed',
            };
        });
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=auth.js.map