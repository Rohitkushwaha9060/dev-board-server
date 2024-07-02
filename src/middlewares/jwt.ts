import { secrets } from '@/core';
import { HttpError } from '@/errors';
import { utilsService } from '@/services';
import { Request, Response, NextFunction } from 'express';

export const jwtMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken =
        req.cookies['accessToken'] ||
        req.headers.authorization?.split(' ')[1] ||
        null;

    if (!accessToken) {
        return next(new HttpError('No token provided', 401));
    }

    const decodedToken: any = utilsService.verifyTokenJwt(
        accessToken,
        secrets.ACCESS_TOKEN_SECRET
    );

    // check if token is valid
    if (!decodedToken) {
        return {
            statusCode: 401,
            message: 'Invalid token',
        };
    }

    req.user = {
        id: decodedToken.id,
        role: decodedToken.role,
    };

    return next();
};
