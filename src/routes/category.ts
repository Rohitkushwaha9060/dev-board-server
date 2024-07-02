import { Router } from 'express';
import { tagAndCategoryController } from '@/controllers';
import { errorHandler } from '@/errors';
import { jwtMiddleware, checkPermissionMiddleware } from '@/middlewares';
import exp from 'constants';

const router = Router();

router
    .route('/')
    .post(
        errorHandler(jwtMiddleware),
        errorHandler(checkPermissionMiddleware),
        errorHandler(tagAndCategoryController.createCategory)
    )
    .get(errorHandler(tagAndCategoryController.getAllCategories));

router
    .route('/:categoryId')
    .patch(
        errorHandler(jwtMiddleware),
        errorHandler(checkPermissionMiddleware),
        errorHandler(tagAndCategoryController.updateCategory)
    )
    .delete(errorHandler(tagAndCategoryController.deleteCategory))
    .get(errorHandler(tagAndCategoryController.getCategoryById));

export { router as categoryRoutes };
