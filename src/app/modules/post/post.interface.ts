import { Types } from 'mongoose'

export interface IComment {
  user: Types.ObjectId
  content: string
}

export interface IPost {
  _id: Types.ObjectId
  title: string
  description: string
  author: Types.ObjectId
  category:
    | 'Watch'
    | 'Software Engineering'
    | 'Tech'
    | 'ML'
    | 'VR'
    | 'Mobile'
    | 'Macbook'
    | 'Gaming'
    | 'Others'
  tags?: string[]
  isPremium: boolean
  upVotes: Types.ObjectId[]
  // upVotes: string[]
  downVotes: Types.ObjectId[]
  comments: IComment[]
  // images?: string[]
  thumbnailImage: string
  contents: string
  status: 'Draft' | 'Published'
  pdfVersion?: string
  isDeleted: boolean
}
