import { secrets } from '@/core';
import { ServiceResponse } from '@/types';
import { emailService } from './email';
import { utilsService } from './utils';
import { UserModel } from '@/model';

class AuthService {
    // sign up
    async signUp(
        name: string,
        email: string,
        phone: string,
        password: string
    ): Promise<ServiceResponse> {
        // check if email is already in use
        const user = await UserModel.findOne({ email });

        // check if email is already in use
        if (user) {
            return {
                statusCode: 400,
                message: 'Email already in use',
                data: {
                    user,
                },
            };
        }

        // hash password
        const hashedPassword = await utilsService.hashPasswordBcrypt(password);

        // otp verification
        const otp = String(await utilsService.generateOTP());

        // create user
        const newUser = await UserModel.create({
            name,
            email,
            phone,
            password: hashedPassword,
            otp,
        });

        // generate token
        const token = await utilsService.createTokenJwt(
            {
                name,
                email,
            },
            secrets.ACCESS_TOKEN_SECRET,
            '1d'
        );

        // update user
        await UserModel.updateOne({ email }, { token });

        // send verification email
        await emailService.sendVerificationEmail(email, otp);

        // return response
        return {
            statusCode: 201,
            message: 'success',
            data: {
                user: newUser,
                token,
            },
        };
    }

    // verification mail
    async sendVerificationMail(email: string) {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return {
                statusCode: 404,
                message: 'User not found',
            };
        }

        // already verified
        if (user.isVerified) {
            return {
                statusCode: 400,
                message: 'User already verified',
            };
        }

        // otp verification
        const otp = String(await utilsService.generateOTP());

        // generate token
        const token = await utilsService.createTokenJwt(
            {
                email: user.email,
            },
            secrets.ACCESS_TOKEN_SECRET,
            '1d'
        );

        // update user
        await UserModel.updateOne({ email }, { otp, token });

        // send verification email
        await emailService.sendVerificationEmail(email, otp);

        // return response
        return {
            statusCode: 200,
            message: 'success',
            data: {
                token,
            },
        };
    }

    // verify email
    async verifyEmail(token: string, otp: string) {
        // check if token is valid
        const decodedToken: any = await utilsService.verifyTokenJwt(
            token,
            secrets.ACCESS_TOKEN_SECRET
        );

        // check if token is valid
        if (!decodedToken) {
            return {
                statusCode: 401,
                message: 'Invalid token',
            };
        }

        // check if email is valid
        const user = await UserModel.findOne({
            email: decodedToken.email,
            token,
        });

        // check if user exists
        if (!user) {
            return {
                statusCode: 404,
                message: 'User not found',
            };
        }

        // check user already verified
        if (user.isVerified) {
            return {
                statusCode: 400,
                message: 'User already verified',
            };
        }

        // check if otp is valid
        if (user.otp !== otp) {
            return {
                statusCode: 400,
                message: 'OTP is invalid',
            };
        }

        // update user
        await UserModel.updateOne(
            { email: decodedToken.email },
            { isVerified: true, otp: null, token: null }
        );

        //password reset
        user.password = '';

        // return response
        return {
            statusCode: 200,
            message: 'success',
            data: {
                user,
            },
        };
    }

    // sign in
    async signIn(email: string, password: string) {
        // find user
        const user = await UserModel.findOne({ email });

        if (!user) {
            return {
                statusCode: 404,
                message: 'User not fount',
            };
        }

        // check email is verified and approved
        if (!user.isVerified) {
            return {
                statusCode: 401,
                message: 'your email is not verified',
            };
        }

        // password validation
        const isMatch = await utilsService.comparePasswordBcrypt(
            password,
            user.password!
        );

        if (!isMatch) {
            return {
                statusCode: 401,
                message: 'invalid credentials',
            };
        }

        // generate tokens
        const accessToken = await utilsService.createTokenJwt(
            {
                id: user.id,
                role: user.role,
            },
            secrets.ACCESS_TOKEN_SECRET,
            '1d'
        );

        const refreshToken = await utilsService.createTokenJwt(
            {
                id: user.id,
            },
            secrets.REFRESH_TOKEN_SECRET,
            '7d'
        );

        // set token in db
        await UserModel.updateOne({ id: user.id }, { token: refreshToken });

        return {
            statusCode: 200,
            message: 'sign in success',
            data: {
                accessToken,
                refreshToken,
            },
        };
    }

    // sign out
    async signOut(userId: string) {
        await UserModel.updateOne({ id: userId }, { token: null });
        return {
            statusCode: 200,
            message: 'sign out success',
        };
    }
}

export const authService = new AuthService();
