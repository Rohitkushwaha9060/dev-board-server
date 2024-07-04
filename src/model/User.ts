import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    avatar: {
        url: String,
        publicKey: String,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
        default: null,
    },
    otp: {
        type: String,
        default: null,
    },
    credit: {
        type: Number,
        default: 0,
    },
});

export const UserModel = mongoose.model('Users', userSchema);
