import { HttpError } from '@/errors';
import { emailSchema, otpSchema, signUpSchema, signInSchema } from '@/core';
import { authService } from '@/services';
import { Request, Response, NextFunction } from 'express';

class AuthController {
    // sign up
    async signUp(req: Request, res: Response, next: NextFunction) {
        // data validation
        const { data, error } = signUpSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        const response = await authService.signUp(
            data.name,
            data.email,
            data.phone,
            data.password
        );

        if (response.statusCode === 201) {
            res.cookie('token', response?.data?.token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 1,
                sameSite: 'none',
                secure: true,
            });
            return res.status(201).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // send verification mail
    async sendVerificationMail(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { data, error } = emailSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        const response = await authService.sendVerificationMail(data?.email);

        if (response.statusCode === 200) {
            res.cookie('token', response?.data?.token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 1,
                sameSite: 'none',
                secure: true,
            });

            return res.status(200).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // verify email
    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        const { data, error } = otpSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        const token = req.token!;
        if (!token) {
            return next(new HttpError('Token is required', 400));
        }

        const response = await authService.verifyEmail(token, data.otp);

        if (response.statusCode === 200) {
            res.cookie('token', null, {
                httpOnly: true,
                maxAge: 60,
                sameSite: 'none',
                secure: true,
            });
            return res.status(200).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // sign in
    async signin(req: Request, res: Response, next: NextFunction) {
        const { data, error } = signInSchema.safeParse(req.body);

        if (error) {
            return next(new HttpError(error.issues[0].message, 400, error));
        }

        // response
        const response = await authService.signIn(data.email, data.password);

        if (response.statusCode === 200) {
            res.cookie('accessToken', response.data?.accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 1,
                sameSite: 'none',
                secure: true,
            });

            res.cookie('refreshToken', response.data?.refreshToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7,
                sameSite: 'none',
                secure: true,
            });
            return res.status(200).json({
                statusCode: response.statusCode,
                message: response.message,
                data: response.data,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }

    // sign out
    async signout(req: Request, res: Response, next: NextFunction) {
        const response = await authService.signOut(req?.user?.id!);

        if (response.statusCode === 200) {
            res.cookie('accessToken', null, {
                httpOnly: true,
                maxAge: 60,
                sameSite: 'none',
                secure: true,
            });

            res.cookie('refreshToken', null, {
                httpOnly: true,
                maxAge: 60,
                sameSite: 'none',
                secure: true,
            });
            return res.status(200).json({
                statusCode: response.statusCode,
                message: response.message,
            });
        } else {
            return next(new HttpError(response.message, response.statusCode));
        }
    }
}
export const authController = new AuthController();
