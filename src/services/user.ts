import {
    AnswerModel,
    BlogCommentModel,
    BlogModel,
    QAModel,
    UserModel,
} from '@/model';
import { utilsService } from './utils';

class UserService {
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

    // update profile
    async updateProfile(userId: string, data: any) {
        // check if user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return {
                statusCode: 404,
                message: 'User not found',
            };
        }
        // check if user is the author
        //@ts-ignore
        if (user._id != userId) {
            return {
                statusCode: 400,
                message: 'Access denied',
            };
        }
        // update user
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: user.id },
            {
                name: data.name,
            },
            {
                new: true,
            }
        );

        //@ts-ignore
        updatedUser.password = undefined;
        //@ts-ignore
        updatedUser.otp = undefined;
        //@ts-ignore
        updatedUser.token = undefined;

        return {
            statusCode: 200,
            message: 'profile updated',
            data: updatedUser,
        };
    }

    // delete profile
    async deleteProfile(userId: any) {
        // check if user exists
        const user = await UserModel.findById(userId);

        if (!user) {
            return {
                statusCode: 404,
                message: 'User not found',
            };
        }

        // check if user is the author
        if (user._id != userId) {
            return {
                statusCode: 400,
                message: 'Access denied',
            };
        }

        // delete all answers
        await AnswerModel.deleteMany({ author: userId });
        // delete all questions
        await QAModel.deleteMany({ author: userId });
        // delete all blogs
        await BlogModel.deleteMany({ author: userId });
        // delete all comments
        await BlogCommentModel.deleteMany({ author: userId });

        // delete user
        await UserModel.deleteOne({ _id: userId });

        return {
            statusCode: 200,
            message: 'profile deleted',
        };
    }

    // get top ten users
    async getTopTenUsers() {
        // get all users
        const topUsers = await UserModel.find()
            .sort({ credit: -1 })
            .limit(10)
            .select('-password -otp -token');

        if (topUsers.length === 0) {
            return {
                statusCode: 404,
                message: 'No users found',
            };
        }

        return {
            statusCode: 200,
            message: 'Top ten users',
            data: topUsers,
        };
    }
}

export const userService = new UserService();
