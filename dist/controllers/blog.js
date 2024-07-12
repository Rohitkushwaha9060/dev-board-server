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
exports.blogController = void 0;
const core_1 = require("../core");
const errors_1 = require("../errors");
const services_1 = require("../services");
class BlogController {
    // create blog
    createBlog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { data, error } = core_1.blogSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.blogService.createBlog({
                title: data.title,
                content: data.content,
                tags: JSON.parse(data.tags),
                categories: JSON.parse(data.categories),
                author: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                image: req.file,
            });
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
    // update blog by id
    updateBlogById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.params.id) {
                return next(new errors_1.HttpError('Blog id is required', 400));
            }
            const { data, error } = core_1.blogSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.blogService.updateBlogById({
                id: req.params.id,
                title: data.title,
                content: data.content,
                tags: JSON.parse(data.tags),
                categories: JSON.parse(data.categories),
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                image: req.file,
            });
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
    // get blogs
    getBlogs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.blogService.getBlogs(req.query);
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
    // get all blogs by author
    getAllBlogsByAuthor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield services_1.blogService.getAllBlogsByAuthor((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.query);
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
    // get blog by slug
    getBlogBySlug(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.blogService.getBlogBySlug(req.params.slug);
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
    // delete blog by id
    deleteBlogById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id) {
                return next(new errors_1.HttpError('Blog id is required', 400));
            }
            const response = yield services_1.blogService.deleteBlogById(req.params.id);
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
    // toggle like by blog id
    toggleBlogLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.params.id) {
                return next(new errors_1.HttpError('Blog id is required', 400));
            }
            const response = yield services_1.blogService.toggleBlogLike(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
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
    // toggle is published
    toggleIsPublished(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.params.id) {
                return next(new errors_1.HttpError('Blog id is required', 400));
            }
            const response = yield services_1.blogService.toggleIsPublished(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
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
    // top blogs
    topBlogs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.blogService.topBlogs(req.query);
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
    // add comment
    addComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.params.id) {
                return next(new errors_1.HttpError('Blog id is required', 400));
            }
            const { data, error } = core_1.commentSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.blogService.addComment({
                blogId: req.params.id,
                comment: data.comment,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            });
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
    // update comment
    updateComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.params.id) {
                return next(new errors_1.HttpError('Comment id is required', 400));
            }
            const { data, error } = core_1.commentSchema.safeParse(req.body);
            if (error) {
                return next(new errors_1.HttpError(error.issues[0].message, 400, error));
            }
            const response = yield services_1.blogService.updateComment({
                id: req.params.id,
                comment: data.comment,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            });
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
    // delete comment
    deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.params.id) {
                return next(new errors_1.HttpError('Comment id is required', 400));
            }
            const response = yield services_1.blogService.deleteComment({
                id: req.params.id,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            });
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
    // get comments
    getComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id) {
                return next(new errors_1.HttpError('Blog id is required', 400));
            }
            const response = yield services_1.blogService.getComments(req.params.id, req.query);
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
    // get comments by id
    getCommentsById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id) {
                return next(new errors_1.HttpError('Blog id is required', 400));
            }
            const response = yield services_1.blogService.getCommentsById(req.params.id);
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
    // get comments by author
    getCommentsByAuthor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                return next(new errors_1.HttpError('User id is required', 400));
            }
            if (!req.params.id) {
                return next(new errors_1.HttpError('Blog id is required', 400));
            }
            const response = yield services_1.blogService.getCommentsByAuthor((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, (_c = req.params) === null || _c === void 0 ? void 0 : _c.id, req.query);
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
exports.blogController = new BlogController();
//# sourceMappingURL=blog.js.map