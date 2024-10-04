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
    | 'Web'
    | 'Software Engineering'
    | 'AI'
    | 'ML'
    | 'VR'
    | 'Mobile'
    | 'Macbook'
    | 'Gaming'
    | 'Others'
  tags?: string[]
  isPremium: boolean
  upvotes: number
  downVotes: number
  comments: IComment[]
  images?: string[]
  status: 'Draft' | 'Published'
  pdfVersion?: string
  isDeleted: boolean
}
