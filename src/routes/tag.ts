import { Router } from 'express';
import { tagAndCategoryController } from '@/controllers';
import { errorHandler } from '@/errors';
import { jwtMiddleware, checkPermissionMiddleware } from '@/middlewares';

const router = Router();

router
    .route('/')
    .post(
        errorHandler(jwtMiddleware),
        errorHandler(checkPermissionMiddleware),
        errorHandler(tagAndCategoryController.createTag)
    )
    .get(errorHandler(tagAndCategoryController.getAllTags));

router
    .route('/:tagId')
    .patch(
        errorHandler(jwtMiddleware),
        errorHandler(checkPermissionMiddleware),
        errorHandler(tagAndCategoryController.updateTag)
    )
    .delete(errorHandler(tagAndCategoryController.deleteTag))
    .get(errorHandler(tagAndCategoryController.getTagById));

export { router as tagRoutes };
