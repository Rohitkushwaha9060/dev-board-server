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
exports.userController = void 0;
const core_1 = require("../core");
const errors_1 = require("../errors");
const services_1 = require("../services");
class UserController {
    // update profile
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { data, error } = core_1.updateProfileSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.userService.updateProfile((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id, data);
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
    // upload avatar
    uploadAvatar(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield services_1.userService.uploadAvatar((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id, req.file);
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
    // delete profile
    deleteProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield services_1.userService.deleteProfile((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (response.statusCode === 200) {
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
    // get top ten users
    getTopTenUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.userService.getTopTenUsers();
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
}
exports.userController = new UserController();
//# sourceMappingURL=user.js.map