/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import AppError from '../../error/AppError'
import { IComment, IPost } from './post.interface'
import Post from './post.model'
import { User } from '../user/user.model'
import { Types } from 'mongoose'

const createPostIntoDB = async (payload: IPost) => {
  const post = await Post.create(payload)
  return post
}

// const getAllPostsFromDB = async ({ searchQuery = '', category = '' }) => {
//   console.log('searchQuery', searchQuery)
//   const query: any = {}

//   // Filter by category if provided
//   if (category) {
//     query.category = category
//   }

//   const posts = await Post.find()
//     .populate('author')
//     .populate('comments.user')
//     .populate('upVotes')
//     .populate('downVotes')
//     .sort('-createdAt')

//   const sortedPosts = posts.sort((a, b) => b.upVotes.length - a.upVotes.length)

//   const mostLikedPosts = sortedPosts.slice(0, 6)

//   let lowestLikedPosts = sortedPosts.slice(6)

//   if (searchQuery) {
//     const queryLowerCase = searchQuery.toLowerCase()
//     lowestLikedPosts = lowestLikedPosts.filter(
//       post =>
//         post?.title.toLowerCase().includes(queryLowerCase) ||
//         post?.description.toLowerCase().includes(queryLowerCase),
//     )
//   }

//   return { mostLikedPosts, lowestLikedPosts }
// }
// GET /api/posts/most-liked
export const getMostLikedPosts = async () => {
  const posts = await Post.find()
    .populate('author')
    .populate('comments.user')
    .populate('upVotes')
    .populate('downVotes')
    .sort('-createdAt')

  const sortedPosts = posts.sort(
    (a, b) => b?.upVotes?.length - a?.upVotes?.length,
  )
  const mostLikedPosts = sortedPosts.slice(0, 6)

  return { mostLikedPosts }
}

export const getLowestLikedPosts = async ({
  searchQuery = '',
  category = '',
}) => {
  const query: any = {}

  // Filter by category if provided
  if (category) {
    query.category = category
  }

  const posts = await Post.find(query)
    .populate('author')
    .populate('comments.user')
    .populate('upVotes')
    .populate('downVotes')
    .sort('-createdAt')

  const sortedPosts = posts.sort(
    (a, b) => b?.upVotes?.length - a?.upVotes?.length,
  )

  // Check if there are enough posts before slicing
  let lowestLikedPosts = []
  if (sortedPosts.length > 6) {
    lowestLikedPosts = sortedPosts.slice(6)
  } else {
    lowestLikedPosts = sortedPosts
  }

  // Apply search query if provided
  if (searchQuery) {
    const queryLowerCase = searchQuery.toLowerCase()
    lowestLikedPosts = lowestLikedPosts.filter(
      post =>
        (post?.title as string)?.toLowerCase().includes(queryLowerCase) ||
        (post?.description as string)?.toLowerCase().includes(queryLowerCase),
    )
  }
  return { lowestLikedPosts }
}

const getSinglePostFromDB = async (postId: string) => {
  const post = await Post.findById(postId)
    .populate('author')
    .populate('comments.user')
  if (!post) {
    throw new Error('Post not found')
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post already deleted')
  }
  return post
}
const updatePostIntoDB = async (postId: string, payload: Partial<IPost>) => {
  const post = await Post.findById(postId)

  if (!post) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post not found')
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post already deleted')
  }
  const updatedPost = await Post.findByIdAndUpdate(postId, payload, {
    new: true,
  })

  return updatedPost
}

const deletePostIntoDB = async (postId: string) => {
  const post = await Post.findById(postId)

  if (!post) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post not found')
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post already deleted')
  }
  const deletedPost = await Post.findByIdAndUpdate(
    postId,
    { isDeleted: true },
    { new: true, runValidators: true },
  )
  return deletedPost
}
const commentIntoDB = async (postId: string, payload: IComment) => {
  const post = await Post.findById(postId)

  if (!post) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post not found')
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post already deleted')
  }
  const result = await Post.findByIdAndUpdate(
    postId,
    {
      $addToSet: { comments: payload },
    },
    { new: true, runValidators: true },
  )
  return result
}
const commentDeleteIntoDB = async (postId: string, commentId: string) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post not found')
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post already deleted')
  }
  const commentExists = post.comments.some(
    comment => comment._id?.toString() === commentId,
  )
  if (!commentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comments are not found')
  }
  const updatePost = await Post.findByIdAndUpdate(
    postId,
    {
      $pull: { comments: { _id: commentId } },
    },
    { new: true, runValidators: true },
  )
  return updatePost
}
const commentsUpdateIntoDB = async (
  postId: string,
  commentId: string,
  newCommment: Record<string, unknown>,
) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post not found')
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post already deleted')
  }
  const commentIndex = post.comments.findIndex(
    comment => comment._id?.toString() === commentId,
  )
  if (commentIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found')
  }
  post.comments[commentIndex].content = newCommment.content as string
  const updatedPost = await post.save()
  return updatedPost
}
const votePostIntoDB = async (
  userId: string,
  postId: string,
  action: 'upvote' | 'downvote',
) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post not found')
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post already deleted')
  }
  const upVotesArray = Array.isArray(post.upVotes) ? post.upVotes : []
  const downVotesArray = Array.isArray(post.downVotes) ? post.downVotes : []

  post.upVotes = upVotesArray.filter(id => id.toString() !== userId) as any
  post.downVotes = downVotesArray.filter(id => id.toString() !== userId) as any

  if (action === 'upvote') {
    post.upVotes.push(new Types.ObjectId(userId))
  }
  if (action === 'downvote') {
    post.downVotes.push(new Types.ObjectId(userId))
  }
  const updatedPost = await post.save()

  return updatedPost
}

// const myPostsIntoDB = async (email: string) => {
//   const user = await User.isUserExists(email)
//   if (!user) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'User not found')
//   }
//   if (user.isDeleted) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'User already deleted')
//   }
//   const userId = user?._id.toString()
//   const result = await Post.find({ author: userId, isDeleted: false })
//     .populate('author')
//     .populate('comments.user')
//     .sort('-createdAt')
//   if (!result) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Posts not found')
//   }
//   return result
// }

const myPostsIntoDB = async (
  email: string,
  searchQuery: string = '',
  category: string = '',
) => {
  const user = await User.isUserExists(email)
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found')
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already deleted')
  }
  const userId = user?._id.toString()

  // Apply search and category filtering in the query
  const query: any = { author: userId, isDeleted: false }
  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: 'i' }
  }
  if (category) {
    query.category = category
  }

  const result = await Post.find(query)
    .populate('author')
    .populate('comments.user')
    .sort('-createdAt')

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Posts not found')
  }

  return result
}

export const PostServices = {
  createPostIntoDB,
  // getAllPostsFromDB,
  getSinglePostFromDB,
  updatePostIntoDB,
  deletePostIntoDB,
  commentIntoDB,
  commentDeleteIntoDB,
  commentsUpdateIntoDB,
  votePostIntoDB,
  myPostsIntoDB,
  getMostLikedPosts,
  getLowestLikedPosts,
}

/*....
1. find all posts 
2. filter the most liked posts
3. filter the lowest liked posts
4. if search query is present,filter the lowest like posts based on search query
5. if category is present,filter the lowest like posts based on category
6. return the both array of most liked and lowest liked posts









..*/
