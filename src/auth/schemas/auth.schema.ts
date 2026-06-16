import { z } from 'zod';

// Shared password rule — single source of truth
const passwordSchema = z
  .string({ message: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number');
// Tip: add .regex(/[^a-zA-Z\d]/, '...') here if you want special chars later

export const loginSchema = z
  .object({
    identifier: z
      .string({ message: 'Email or username is required' })
      .min(1, 'Email or username is required'),
    password: passwordSchema,
    remember: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const { identifier } = data;
    // Only run format checks when the field is non-empty
    // (the .min(1) above already handles the empty case)
    if (!identifier) return;

    if (identifier.includes('@')) {
      const emailResult = z.string().email().safeParse(identifier);
      if (!emailResult.success) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please enter a valid email address',
          path: ['identifier'],
        });
      }
    } else {
      if (identifier.length < 4) {
        ctx.addIssue({
          code: 'custom',
          message: 'Username must be at least 4 characters',
          path: ['identifier'],
        });
      }
    }
  });

export const registerSchema = z
  .object({
    username: z
      .string({ message: 'Username is required' })
      .min(4, 'Username must be at least 4 characters')
      .max(32, 'Username must be at most 32 characters')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers and underscores',
      ),
    email: z
      .string({ message: 'Email is required' })
      .email('Please enter a valid email address'),
    password: passwordSchema,
    confirmPassword: z.string({ message: 'Please confirm your password' }),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const responseSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  refreshToken: z.string().optional(),
  user: z.object({
    id: z.number(),
    username: z.string().min(1),
    email: z.string().email(),
    role: z.string(),
  }),
});
