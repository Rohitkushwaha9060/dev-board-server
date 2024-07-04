import { secrets } from '@/core';
import { ServiceResponse } from '@/types';
import { emailService } from './email';
import { utilsService } from './utils';
import { UserModel } from '@/model';
import fs from 'fs';

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
        await UserModel.updateOne({ _id: user.id }, { otp, token });

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
        }).select('-password');

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
            { _id: user.id },
            { isVerified: true, otp: null, token: null }
        );

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
        await UserModel.updateOne({ _id: user.id }, { token: refreshToken });

        return {
            statusCode: 200,
            message: 'sign in success',
            data: {
                accessToken,
                refreshToken,
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: {
                        url: user.avatar?.url,
                    },
                },
            },
        };
    }

    // get user
    async getUser(userId: string) {
        const user = await UserModel.findOne({ _id: userId }).select(
            '-password -otp -token -__v'
        );

        if (!user) {
            return {
                statusCode: 404,
                message: 'User not found',
            };
        }

        return {
            statusCode: 200,
            message: 'success',
            data: {
                user: user,
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

    // refresh token
    async refreshToken(token: string) {
        // check if token is valid
        const decodedToken: any = await utilsService.verifyTokenJwt(
            token,
            secrets.REFRESH_TOKEN_SECRET
        );

        // check if token is valid
        if (!decodedToken) {
            return {
                statusCode: 401,
                message: 'Invalid token',
            };
        }

        // find user
        const user = await UserModel.findOne({ _id: decodedToken.id });

        if (!user) {
            return {
                statusCode: 404,
                message: 'User not fount',
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
            message: 'token refreshed',
            data: {
                accessToken,
                refreshToken,
            },
        };
    }

    // forget password
    async forgetPassword(email: string) {
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

        // generate otp
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

        return {
            statusCode: 200,
            message: 'success',
            data: {
                token,
            },
        };
    }

    // reset password
    async resetPassword(token: string, otp: string, password: string) {
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

        // check if otp is valid
        if (user.otp !== otp) {
            return {
                statusCode: 400,
                message: 'OTP is invalid',
            };
        }

        // hash password
        const hashedPassword = await utilsService.hashPasswordBcrypt(password);

        // update user
        await UserModel.updateOne(
            { _id: user.id },
            { password: hashedPassword, token: null, otp: null }
        );

        return {
            statusCode: 200,
            message: 'success',
        };
    }

    // change password
    async changePassword(userId: string, password: string) {
        // find user
        const user = await UserModel.findOne({ _id: userId });

        if (!user) {
            return {
                statusCode: 404,
                message: 'User not found',
            };
        }

        // hash password
        const hashedPassword = await utilsService.hashPasswordBcrypt(password);

        // update user
        await UserModel.updateOne(
            { _id: user.id },
            { password: hashedPassword }
        );

        return {
            statusCode: 200,
            message: 'password changed',
        };
    }

    // upload avatar
    async uploadAvatar(userId: string, file: any) {
        // find user
        const user = await UserModel.findOne({ _id: userId });

        if (!user) {
            return {
                statusCode: 404,
                message: 'User not found',
            };
        }

        if (!file) {
            // check if file is valid
            return {
                statusCode: 400,
                message: 'Avatar is required',
            };
        }

        // check extension
        const extName = file.originalname.split('.').pop();
        if (!['png', 'jpg', 'jpeg', 'webp'].includes(extName)) {
            return {
                statusCode: 400,
                message: 'Invalid image extension',
            };
        }

        //upload on cloudinary
        const cloudinaryRes: any = await utilsService.uploadToCloudinary(
            file.path
        );

        if (user.avatar?.url) {
            await utilsService.deleteFromCloudinary(user.avatar?.publicKey!);
        }

        // update user
        await UserModel.updateOne(
            { _id: user.id },
            {
                avatar: {
                    url: cloudinaryRes.secure_url,
                    publicKey: cloudinaryRes.public_id,
                },
            }
        );

        return {
            statusCode: 200,
            message: 'avatar uploaded',
            data: {
                avatar: cloudinaryRes.secure_url,
            },
        };
    }
}

export const authService = new AuthService();
