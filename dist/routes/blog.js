"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const errors_1 = require("../errors");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
exports.blogRoutes = router;
router
    .route('/')
    .post((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(middlewares_1.multerMiddleware.single('image')), (0, errors_1.errorHandler)(controllers_1.blogController.createBlog))
    .get((0, errors_1.errorHandler)(controllers_1.blogController.getBlogs));
router
    .route('/author')
    .get((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.blogController.getAllBlogsByAuthor));
router.route('/:slug').get((0, errors_1.errorHandler)(controllers_1.blogController.getBlogBySlug));
router
    .route('/:id')
    .delete((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.blogController.deleteBlogById))
    .patch((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(middlewares_1.multerMiddleware.single('image')), (0, errors_1.errorHandler)(controllers_1.blogController.updateBlogById));
router.post('/:id/like', (0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.blogController.toggleBlogLike));
router.post('/:id/publish', (0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.blogController.toggleIsPublished));
router
    .route('/:id/comments')
    .post((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.blogController.addComment))
    .get((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.blogController.getComments));
router
    .route('/comments/:id')
    .patch((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.blogController.updateComment))
    .delete((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.blogController.deleteComment))
    .get((0, errors_1.errorHandler)(controllers_1.blogController.getCommentsById));
router
    .route('/:id/comments/author')
    .get((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.blogController.getCommentsByAuthor));
router
    .route('/top/blogs')
    .get((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.blogController.topBlogs));
router
    .route('/author/:id')
    .get((0, errors_1.errorHandler)(controllers_1.blogController.getAllBlogsByAuthorId));
//# sourceMappingURL=blog.js.map