import { model, Schema } from 'mongoose'

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Web',
        'Software Engineering',
        'AI',
        'ML',
        'VR',
        'Mobile',
        'Macbook',
        'Gaming',
        'Others',
      ],
      required: true,
    },
    tags: {
      type: [String],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downVotes: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
    images: {
      type: [String],
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
    pdfVersion: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

postSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

postSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

const Post = model('Post', postSchema)

export default Post
