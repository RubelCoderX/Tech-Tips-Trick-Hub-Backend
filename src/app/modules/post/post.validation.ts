import { z } from 'zod'

const createPostValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').trim(),
    description: z.string().min(1, 'Description is required'),
    author: z.string().nonempty('Author ID is required'),
    category: z.enum([
      'Watch',
      'Software Engineering',
      'Tech',
      'ML',
      'VR',
      'Macbook',
      'Mobile',
      'Gaming',
      'Others',
    ]),
    tags: z.array(z.string()).optional(),
    isPremium: z.boolean().optional(),
    thumbnailImage: z.string().url('Invalid thumbnail URL').optional(),
    contents: z.string().min(1, 'Content is required'),
    status: z.enum(['Draft', 'Published']).default('Draft').optional(),
    pdfVersion: z.string().url('Invalid PDF URL').optional(),
  }),
})
const updatePostValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').trim().optional(),
    description: z.string().min(1, 'Description is required').optional(),

    category: z
      .enum([
        'Watch',
        'Software Engineering',
        'Tech',
        'ML',
        'VR',
        'Macbook',
        'Mobile',
        'Gaming',
        'Others',
      ])
      .optional(),
    tags: z.array(z.string()).optional(),
    isPremium: z.boolean().optional(),
    thumbnailImage: z.string().url('Invalid thumbnail URL').optional(),
    contents: z.string().min(1, 'Content is required'),
  }),
})

export const PostValidation = {
  createPostValidation,
  updatePostValidation,
}
