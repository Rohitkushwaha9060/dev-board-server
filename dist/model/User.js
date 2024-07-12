"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
        url: {
            type: String,
            default: null,
        },
        publicKey: {
            type: String,
            default: null,
        },
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
exports.UserModel = mongoose_1.default.model('Users', userSchema);
//# sourceMappingURL=User.js.map