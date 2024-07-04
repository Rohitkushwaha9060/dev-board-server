"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerSchema = exports.questionSchema = exports.commentSchema = exports.blogSchema = exports.nameSchema = exports.changePasswordSchema = exports.resetPasswordSchema = exports.signInSchema = exports.otpSchema = exports.emailSchema = exports.signUpSchema = void 0;
const z = __importStar(require("zod"));
exports.signUpSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .min(3, { message: 'Name must be at least 3 characters long' }),
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email' }),
    phone: z
        .string({ required_error: 'Phone is required' })
        .min(10, { message: 'Phone must be at least 10 characters long' })
        .optional(),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' }),
});
exports.emailSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email' }),
});
exports.otpSchema = z.object({
    otp: z
        .string({ required_error: 'otp is required' })
        .min(4, { message: 'otp must be 4 characters' }),
});
exports.signInSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' }),
});
exports.resetPasswordSchema = z.object({
    otp: z
        .string({ required_error: 'otp is required' })
        .min(4, { message: 'otp must be 4 characters' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' }),
});
exports.changePasswordSchema = z.object({
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' }),
});
exports.nameSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .min(3, { message: 'Name must be at least 3 characters long' }),
});
exports.blogSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .min(3, { message: 'Title must be at least 3 characters long' }),
    content: z
        .string({ required_error: 'Content is required' })
        .min(3, { message: 'Content must be at least 3 characters long' }),
    tags: z.string({ required_error: 'Tag is required' }),
    categories: z.string({ required_error: 'Category is required' }),
});
exports.commentSchema = z.object({
    comment: z.string({ required_error: 'Content is required' }),
});
exports.questionSchema = z.object({
    question: z
        .string({ required_error: 'Question is required' })
        .min(10, { message: 'Question must be at least 10 characters long' }),
    tags: z.array(z.string({ required_error: 'Tag is required' })),
});
exports.answerSchema = z.object({
    answer: z
        .string({ required_error: 'Answer is required' })
        .min(10, { message: 'Answer must be at least 10 characters long' }),
});
//# sourceMappingURL=schema.js.map