import * as z from 'zod';

export const signUpSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .min(3, { message: 'Name must be at least 3 characters long' }),
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email' }),
    phone: z
        .string({ required_error: 'Phone is required' })
        .min(10, { message: 'Phone must be at least 10 characters long' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' }),
});

export const emailSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email' }),
});

export const otpSchema = z.object({
    otp: z
        .string({ required_error: 'otp is required' })
        .min(4, { message: 'otp must be 4 characters' }),
});

export const signInSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' }),
});

export const resetPasswordSchema = z.object({
    otp: z
        .string({ required_error: 'otp is required' })
        .min(4, { message: 'otp must be 4 characters' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' }),
});

export const changePasswordSchema = z.object({
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' }),
});

export const nameSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .min(3, { message: 'Name must be at least 3 characters long' }),
});

export const blogSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .min(3, { message: 'Title must be at least 3 characters long' }),
    content: z
        .string({ required_error: 'Content is required' })
        .min(3, { message: 'Content must be at least 3 characters long' }),
    tags: z.string({ required_error: 'Tag is required' }),
    categories: z.string({ required_error: 'Category is required' }),
});
