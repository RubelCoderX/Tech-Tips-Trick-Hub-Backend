import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { PostServices } from './post.service'
import AppError from '../../error/AppError'

const createPostFromDB = catchAsync(async (req, res) => {
  const result = await PostServices.createPostIntoDB(req.body)

  sendResponse(res, {
    success: true,
    message: 'Post created successfully',
    statusCode: httpStatus.CREATED,
    data: result,
  })
})

// const getAllPostsFromDB = catchAsync(async (req, res) => {
//   const { searchQuery, category } = req.query

//   const result = await PostServices.getAllPostsFromDB({
//     searchQuery: typeof searchQuery === 'string' ? searchQuery : '',
//     category: typeof category === 'string' ? category : '',
//   })

//   sendResponse(res, {
//     success: true,
//     message: 'All posts fetched successfully',
//     statusCode: httpStatus.OK,
//     data: result,
//   })
// })

const getLowestLikedPostsFromDB = catchAsync(async (req, res) => {
  const { searchQuery, category } = req.query

  const result = await PostServices.getLowestLikedPosts({
    searchQuery: typeof searchQuery === 'string' ? searchQuery : '',
    category: typeof category === 'string' ? category : '',
  })

  sendResponse(res, {
    success: true,
    message: 'Lowest liked posts fetched successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getMostLikedPostsFromDB = catchAsync(async (req, res) => {
  const result = await PostServices.getMostLikedPosts()

  sendResponse(res, {
    success: true,
    message: 'Most liked posts fetched successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const getSinglePostFromDB = catchAsync(async (req, res) => {
  const postId = req.params.postId

  const result = await PostServices.getSinglePostFromDB(postId)
  sendResponse(res, {
    success: true,
    message: 'Post fetched successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const updatePostFromDB = catchAsync(async (req, res) => {
  const postId = req.params.postId
  const result = await PostServices.updatePostIntoDB(postId, req.body)
  sendResponse(res, {
    success: true,
    message: 'Post updated successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const deletedPostFromDB = catchAsync(async (req, res) => {
  const postId = req.params.postId
  const result = await PostServices.deletePostIntoDB(postId)
  sendResponse(res, {
    success: true,
    message: 'Post deleted successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const commentPosFromDB = catchAsync(async (req, res) => {
  const postId = req.params.postId
  const result = await PostServices.commentIntoDB(postId, req.body)
  sendResponse(res, {
    success: true,
    message: 'Commented successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const commentDeletFromDB = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params
  const result = await PostServices.commentDeleteIntoDB(postId, commentId)
  sendResponse(res, {
    success: true,
    message: 'Comment deleted successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const updateCommentFromDB = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params
  const result = await PostServices.commentsUpdateIntoDB(
    postId,
    commentId,
    req.body,
  )
  sendResponse(res, {
    success: true,
    message: 'Comment updated successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const votePost = catchAsync(async (req, res) => {
  const userId = req.user.userId

  const { postId } = req.params
  const { action } = req.body

  if (!['upvote', 'downvote'].includes(action)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid action')
  }
  const result = await PostServices.votePostIntoDB(userId, postId, action)

  sendResponse(res, {
    success: true,
    message: 'Post voted successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
// const myPosts = catchAsync(async (req, res) => {
//   const email = req.user.email
//   const result = await PostServices.myPostsIntoDB(email)
//   sendResponse(res, {
//     success: true,
//     message: 'My posts fetched successfully',
//     statusCode: httpStatus.OK,
//     data: result,
//   })
// })

const myPosts = catchAsync(async (req, res) => {
  const email = req.user.email
  const { searchQuery = '', category = '' } = req.query

  const result = await PostServices.myPostsIntoDB(
    email,
    searchQuery as string,
    category as string,
  )
  sendResponse(res, {
    success: true,
    message: 'My posts fetched successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const PostControllers = {
  createPostFromDB,
  // getAllPostsFromDB,
  getSinglePostFromDB,
  updatePostFromDB,
  deletedPostFromDB,
  commentPosFromDB,
  commentDeletFromDB,
  updateCommentFromDB,
  votePost,
  myPosts,
  getLowestLikedPostsFromDB,
  getMostLikedPostsFromDB,
}
