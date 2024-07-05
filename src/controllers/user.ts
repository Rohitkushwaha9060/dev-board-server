import { HttpError } from '@/errors';
import { userService } from '@/services';
import { Request, Response, NextFunction } from 'express';

class UserController {
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
}

export const userController = new UserController();
