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
exports.userService = void 0;
const model_1 = require("../model");
const utils_1 = require("./utils");
class UserService {
    // upload avatar
    uploadAvatar(userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // find user
            const user = yield model_1.UserModel.findOne({ _id: userId });
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                };
            }
            if (!file) {
                // check if file is valid
                return {
                    statusCode: 400,
                    message: 'Avatar is required',
                };
            }
            // check extension
            const extName = file.originalname.split('.').pop();
            if (!['png', 'jpg', 'jpeg', 'webp'].includes(extName)) {
                return {
                    statusCode: 400,
                    message: 'Invalid image extension',
                };
            }
            //upload on cloudinary
            const cloudinaryRes = yield utils_1.utilsService.uploadToCloudinary(file.path);
            if ((_a = user.avatar) === null || _a === void 0 ? void 0 : _a.url) {
                yield utils_1.utilsService.deleteFromCloudinary((_b = user.avatar) === null || _b === void 0 ? void 0 : _b.publicKey);
            }
            // update user
            yield model_1.UserModel.updateOne({ _id: user.id }, {
                avatar: {
                    url: cloudinaryRes.secure_url,
                    publicKey: cloudinaryRes.public_id,
                },
            });
            return {
                statusCode: 200,
                message: 'avatar uploaded',
                data: {
                    avatar: cloudinaryRes.secure_url,
                },
            };
        });
    }
    // update profile
    updateProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if user exists
            const user = yield model_1.UserModel.findById(userId);
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                };
            }
            // check if user is the author
            //@ts-ignore
            if (user._id != userId) {
                return {
                    statusCode: 400,
                    message: 'Access denied',
                };
            }
            // update user
            const updatedUser = yield model_1.UserModel.findOneAndUpdate({ _id: user.id }, {
                name: data.name,
            }, {
                new: true,
            });
            //@ts-ignore
            updatedUser.password = undefined;
            //@ts-ignore
            updatedUser.otp = undefined;
            //@ts-ignore
            updatedUser.token = undefined;
            return {
                statusCode: 200,
                message: 'profile updated',
                data: updatedUser,
            };
        });
    }
    // delete profile
    deleteProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if user exists
            const user = yield model_1.UserModel.findById(userId);
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                };
            }
            // check if user is the author
            if (user._id != userId) {
                return {
                    statusCode: 400,
                    message: 'Access denied',
                };
            }
            // delete all answers
            yield model_1.AnswerModel.deleteMany({ author: userId });
            // delete all questions
            yield model_1.QAModel.deleteMany({ author: userId });
            // delete all blogs
            yield model_1.BlogModel.deleteMany({ author: userId });
            // delete all comments
            yield model_1.BlogCommentModel.deleteMany({ author: userId });
            // delete user
            yield model_1.UserModel.deleteOne({ _id: userId });
            return {
                statusCode: 200,
                message: 'profile deleted',
            };
        });
    }
    // get top ten users
    getTopTenUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            // get all users
            const topUsers = yield model_1.UserModel.find()
                .sort({ credit: -1 })
                .limit(10)
                .select('-password -otp -token');
            if (topUsers.length === 0) {
                return {
                    statusCode: 404,
                    message: 'No users found',
                };
            }
            return {
                statusCode: 200,
                message: 'Top ten users',
                data: topUsers,
            };
        });
    }
}
exports.userService = new UserService();
//# sourceMappingURL=user.js.map