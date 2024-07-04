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
exports.tagAndCategoryController = void 0;
const core_1 = require("../core");
const errors_1 = require("../errors");
const services_1 = require("../services");
class TagAndCategoryController {
    // create tag
    createTag(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = core_1.nameSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.tagAndCategoryService.createTag(data.name);
            if (response.statusCode === 201) {
                return res.status(response.statusCode).json({
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
    // update tag
    updateTag(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = core_1.nameSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.tagAndCategoryService.updateTag(req.params.tagId, data.name);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
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
    // delete tag
    deleteTag(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.tagId) {
                return next(new errors_1.HttpError('Tag id is required', 400));
            }
            const response = yield services_1.tagAndCategoryService.deleteTag(req.params.tagId);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // get all tags
    getAllTags(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.tagAndCategoryService.getAllTags();
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
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
    // get tag by id
    getTagById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.tagId) {
                return next(new errors_1.HttpError('Tag id is required', 400));
            }
            const response = yield services_1.tagAndCategoryService.getTagById(req.params.tagId);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
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
    // create category
    createCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = core_1.nameSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.tagAndCategoryService.createCategory(data.name);
            if (response.statusCode === 201) {
                return res.status(response.statusCode).json({
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
    // update category
    updateCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = core_1.nameSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.tagAndCategoryService.updateCategory(req.params.categoryId, data.name);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
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
    // delete category
    deleteCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.categoryId) {
                return next(new errors_1.HttpError('Category id is required', 400));
            }
            const response = yield services_1.tagAndCategoryService.deleteCategory(req.params.categoryId);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
                    statusCode: response.statusCode,
                    message: response.message,
                });
            }
            else {
                return next(new errors_1.HttpError(response.message, response.statusCode));
            }
        });
    }
    // get all categories
    getAllCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.tagAndCategoryService.getAllCategories();
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
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
    // get category by id
    getCategoryById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.categoryId) {
                return next(new errors_1.HttpError('Category id is required', 400));
            }
            const response = yield services_1.tagAndCategoryService.getCategoryById(req.params.categoryId);
            if (response.statusCode === 200) {
                return res.status(response.statusCode).json({
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
exports.tagAndCategoryController = new TagAndCategoryController();
//# sourceMappingURL=tagAndCategory.js.map