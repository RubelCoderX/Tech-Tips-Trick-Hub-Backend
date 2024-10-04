import { z } from 'zod'

// Create User Schema
const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string()
      .email('Please provide a valid email address')
      .nonempty('Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['user', 'admin']).optional(),
    gender: z.enum(['male', 'female'], {
      required_error: 'Gender is required',
    }),
    birthDate: z.string().nonempty('Birth date is required'),
    profileImage: z.string().optional().nullable(),
    followers: z.array(z.string()).optional().default([]),
    following: z.array(z.string()).optional().default([]),
    payments: z.array(z.string()).optional().default([]),

    bio: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  }),
})

// Update User Schema
const updateUserSchema = createUserSchema.partial().extend({
  isDeleted: z.boolean().optional(),
})

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'email is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
})
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
})
// Exporting the schemas
export {
  createUserSchema,
  updateUserSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
}
