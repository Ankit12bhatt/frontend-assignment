import { z } from 'zod';

export const forgetPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  rememberMe: z.boolean().optional(),
});
export const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' }),
});
export const confirmPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string(),
  })
  .passthrough()
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });
