import { nameSchema } from '@/core';
import { HttpError } from '@/errors';
import { tagAndCategoryService } from '@/services';
import { NextFunction, Request, Response } from 'express';

class TagAndCategoryController {
    // create tag
    async createTag(req: Request, res: Response, next: NextFunction) {
        const { data, error } = nameSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        const response = await tagAndCategoryService.createTag(data.name);

        if (response.statusCode === 201) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // update tag
    async updateTag(req: Request, res: Response, next: NextFunction) {
        const { data, error } = nameSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        const response = await tagAndCategoryService.updateTag(
            req.params.tagId,
            data.name
        );

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // delete tag
    async deleteTag(req: Request, res: Response, next: NextFunction) {
        if (!req.params.tagId) {
            return next(new HttpError('Tag id is required', 400));
        }

        const response = await tagAndCategoryService.deleteTag(
            req.params.tagId
        );

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // get all tags
    async getAllTags(req: Request, res: Response, next: NextFunction) {
        const response = await tagAndCategoryService.getAllTags();

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // get tag by id
    async getTagById(req: Request, res: Response, next: NextFunction) {
        if (!req.params.tagId) {
            return next(new HttpError('Tag id is required', 400));
        }

        const response = await tagAndCategoryService.getTagById(
            req.params.tagId
        );

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // create category
    async createCategory(req: Request, res: Response, next: NextFunction) {
        const { data, error } = nameSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        const response = await tagAndCategoryService.createCategory(data.name);

        if (response.statusCode === 201) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // update category
    async updateCategory(req: Request, res: Response, next: NextFunction) {
        const { data, error } = nameSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        const response = await tagAndCategoryService.updateCategory(
            req.params.categoryId,
            data.name
        );

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // delete category
    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        if (!req.params.categoryId) {
            return next(new HttpError('Category id is required', 400));
        }

        const response = await tagAndCategoryService.deleteCategory(
            req.params.categoryId
        );

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // get all categories
    async getAllCategories(req: Request, res: Response, next: NextFunction) {
        const response = await tagAndCategoryService.getAllCategories();

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // get category by id
    async getCategoryById(req: Request, res: Response, next: NextFunction) {
        if (!req.params.categoryId) {
            return next(new HttpError('Category id is required', 400));
        }

        const response = await tagAndCategoryService.getCategoryById(
            req.params.categoryId
        );

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }
}

export const tagAndCategoryController = new TagAndCategoryController();
