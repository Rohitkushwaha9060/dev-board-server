import { HttpError } from '@/errors';
import { Request, Response, NextFunction } from 'express';

export const checkPermissionMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(new HttpError('Unauthorized', 401));
    }

    if (req.user.role !== 'admin') {
        return next(new HttpError('Access denied', 401));
    }

    return next();
};
