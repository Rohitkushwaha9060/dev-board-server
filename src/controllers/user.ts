import { updateProfileSchema } from '@/core';
import { HttpError } from '@/errors';
import { userService } from '@/services';
import { Request, Response, NextFunction } from 'express';

class UserController {
    // update profile
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        const { data, error } = updateProfileSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        const response = await userService.updateProfile(req?.user?.id!, data);

        if (response.statusCode === 200) {
            return res.status(200).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }
    // upload avatar
    async uploadAvatar(req: Request, res: Response, next: NextFunction) {
        const response = await userService.uploadAvatar(
            req?.user?.id!,
            req.file
        );

        if (response.statusCode === 200) {
            return res.status(200).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // delete profile
    async deleteProfile(req: Request, res: Response, next: NextFunction) {
        const response = await userService.deleteProfile(req?.user?.id!);

        if (response.statusCode === 200) {
            return res.status(200).json({
                statusCode: response.statusCode,
                message: response.message,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // get top ten users
    async getTopTenUsers(req: Request, res: Response, next: NextFunction) {
        const response = await userService.getTopTenUsers();

        if (response.statusCode === 200) {
            return res.status(200).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }
}

export const userController = new UserController();
