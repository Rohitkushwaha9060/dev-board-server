import { Router } from 'express';
import { blogController } from '@/controllers';
import { errorHandler } from '@/errors';
import { jwtMiddleware, multerMiddleware } from '@/middlewares';

const router = Router();

router
    .route('/')
    .post(
        errorHandler(jwtMiddleware),
        errorHandler(multerMiddleware.single('image')),
        errorHandler(blogController.createBlog)
    )
    .get(errorHandler(blogController.getBlogs));

router
    .route('/author')
    .get(
        errorHandler(jwtMiddleware),
        errorHandler(blogController.getAllBlogsByAuthor)
    );

router.route('/:slug').get(errorHandler(blogController.getBlogBySlug));

router
    .route('/:id')
    .delete(
        errorHandler(jwtMiddleware),
        errorHandler(blogController.deleteBlogById)
    )
    .patch(
        errorHandler(jwtMiddleware),
        errorHandler(multerMiddleware.single('image')),
        errorHandler(blogController.updateBlogById)
    );

router.post(
    '/:id/like',
    errorHandler(jwtMiddleware),
    errorHandler(blogController.toggleBlogLike)
);

router.post(
    '/:id/publish',
    errorHandler(jwtMiddleware),
    errorHandler(blogController.toggleIsPublished)
);

router
    .route('/:id/comments')
    .post(errorHandler(jwtMiddleware), errorHandler(blogController.addComment))
    .get(errorHandler(jwtMiddleware), errorHandler(blogController.getComments));

router
    .route('/comments/:id')
    .patch(
        errorHandler(jwtMiddleware),
        errorHandler(blogController.updateComment)
    )
    .delete(
        errorHandler(jwtMiddleware),
        errorHandler(blogController.deleteComment)
    )
    .get(errorHandler(blogController.getCommentsById));

router
    .route('/:id/comments/author')
    .get(
        errorHandler(jwtMiddleware),
        errorHandler(blogController.getCommentsByAuthor)
    );

router
    .route('/top/blogs')
    .get(errorHandler(jwtMiddleware), errorHandler(blogController.topBlogs));

router
    .route('/author/:id')
    .get(errorHandler(blogController.getAllBlogsByAuthorId));

export { router as blogRoutes };
