import { blogSchema, commentSchema } from '@/core';
import { HttpError } from '@/errors';
import { blogService } from '@/services';
import { NextFunction, Request, Response } from 'express';

class BlogController {
    // create blog
    async createBlog(req: Request, res: Response, next: NextFunction) {
        const { data, error } = blogSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        const response = await blogService.createBlog({
            title: data.title,
            content: data.content,
            tags: JSON.parse(data.tags!),
            categories: JSON.parse(data.categories!),
            author: req.user?.id!,
            image: req.file,
        });

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

    // update blog by id
    async updateBlogById(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            return next(new HttpError('Blog id is required', 400));
        }
        const { data, error } = blogSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        const response = await blogService.updateBlogById({
            id: req.params.id,
            title: data.title,
            content: data.content,
            tags: JSON.parse(data.tags!),
            categories: JSON.parse(data.categories!),
            userId: req.user?.id!,
            image: req.file,
        });

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

    // get blogs
    async getBlogs(req: Request, res: Response, next: NextFunction) {
        const response = await blogService.getBlogs(req.query);

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

    // get all blogs by author
    async getAllBlogsByAuthor(req: Request, res: Response, next: NextFunction) {
        const response = await blogService.getAllBlogsByAuthor(
            req.user?.id!,
            req.query
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

    // get blog by slug
    async getBlogBySlug(req: Request, res: Response, next: NextFunction) {
        const response = await blogService.getBlogBySlug(req.params.slug);

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

    // delete blog by id
    async deleteBlogById(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            return next(new HttpError('Blog id is required', 400));
        }
        const response = await blogService.deleteBlogById(req.params.id);

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // toggle like by blog id
    async toggleBlogLike(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            return next(new HttpError('Blog id is required', 400));
        }
        const response = await blogService.toggleBlogLike(
            req.params.id,
            req.user?.id!
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

    // toggle is published
    async toggleIsPublished(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            return next(new HttpError('Blog id is required', 400));
        }
        const response = await blogService.toggleIsPublished(
            req.params.id,
            req.user?.id!
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

    // add comment
    async addComment(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            return next(new HttpError('Blog id is required', 400));
        }
        const { data, error } = commentSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        const response = await blogService.addComment({
            blogId: req.params.id,
            comment: data.comment,
            userId: req.user?.id!,
        });

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

    // update comment
    async updateComment(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            return next(new HttpError('Comment id is required', 400));
        }
        const { data, error } = commentSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        const response = await blogService.updateComment({
            id: req.params.id,
            comment: data.comment,
            userId: req.user?.id!,
        });

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

    // delete comment
    async deleteComment(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            return next(new HttpError('Comment id is required', 400));
        }
        const response = await blogService.deleteComment({
            id: req.params.id,
            userId: req.user?.id!,
        });

        if (response.statusCode === 200) {
            return res.status(response.statusCode).json({
                statusCode: response.statusCode,
                message: response.message,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // get comments
    async getComments(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            return next(new HttpError('Blog id is required', 400));
        }
        const response = await blogService.getComments(
            req.params.id,
            req.query
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

    // get comments by id
    async getCommentsById(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            return next(new HttpError('Blog id is required', 400));
        }
        const response = await blogService.getCommentsById(req.params.id);

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

    // get comments by author
    async getCommentsByAuthor(req: Request, res: Response, next: NextFunction) {
        if (!req.user?.id) {
            return next(new HttpError('User id is required', 400));
        }

        if (!req.params.id) {
            return next(new HttpError('Blog id is required', 400));
        }

        const response = await blogService.getCommentsByAuthor(
            req.user?.id!,
            req.params?.id,
            req.query
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

export const blogController = new BlogController();
