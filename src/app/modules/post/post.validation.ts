import { z } from 'zod'

const commentValidationSchema = z.object({
  user: z.string().nonempty('User ID is required'),
  content: z.string().min(1, 'Content is required'),
  isDeleted: z.boolean().default(false),
})

const createPostValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').trim(),
    description: z.string().min(1, 'Description is required'),
    author: z.string().nonempty('Author ID is required'),
    category: z.enum([
      'Web',
      'Software Engineering',
      'AI',
      'ML',
      'VR',
      'Macbook',
      'Mobile',
      'Gaming',
      'Others',
    ]),
    tags: z.array(z.string()).optional(),
    isPremium: z.boolean().default(false),
    upVotes: z.number().int().nonnegative().default(0),
    downVotes: z.number().int().nonnegative().default(0),
    comments: z.array(commentValidationSchema).optional(),
    images: z.array(z.string().url('Invalid image URL')).optional(),
    status: z.enum(['Draft', 'Published']).default('Draft'),
    pdfVersion: z.string().url('Invalid PDF URL').optional(),
    isDeleted: z.boolean().default(false),
  }),
})

const updatePostValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').trim().optional(),
    content: z.string().min(1, 'Content is required').optional(),
    category: z
      .enum(['Web', 'Software Engineering', 'AI', 'ML', 'VR', 'Others'])
      .optional(),
    tags: z.array(z.string()).optional(),
    isPremium: z.boolean().default(false).optional(),
    images: z.array(z.string().url('Invalid image URL')).optional(),
  }),
})

export const PostValidation = {
  createPostValidation,
  updatePostValidation,
}
