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

router
    .route('/:id/comment')
    .post(errorHandler(jwtMiddleware), errorHandler(blogController.addComment));

router
    .route('/comment/:id')
    .patch(
        errorHandler(jwtMiddleware),
        errorHandler(blogController.updateComment)
    )
    .delete(
        errorHandler(jwtMiddleware),
        errorHandler(blogController.deleteComment)
    );

export { router as blogRoutes };
