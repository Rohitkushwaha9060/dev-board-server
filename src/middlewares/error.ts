import { secrets } from '@/core';
import { HttpError } from '@/errors';
import { Request, Response, NextFunction } from 'express';

const globalErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const status = err.status;
    const message = err.message || 'Internal Server Error';
    const error = err.error || null;

    if (secrets.NODE_ENV === 'production') {
        return res.status(statusCode).json({ statusCode, message, status });
    }
    return res.status(statusCode).json({ statusCode, message, status, error });
};

export { globalErrorHandler };
