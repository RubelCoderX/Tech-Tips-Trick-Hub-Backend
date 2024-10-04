import express from 'express'

import { PostValidation } from './post.validation'

import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { PostControllers } from './post.controller'
import validateRequest from '../../middleware/validRequest'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(PostValidation.createPostValidation),
  PostControllers.createPostFromDB,
)

router.get('/', PostControllers.getAllPostsFromDB)
router.get(
  '/my-posts',
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.myPosts,
)
router.get(
  '/:postId',
  // auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.getSinglePostFromDB,
)

router.put(
  '/:postId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(PostValidation.updatePostValidation),
  PostControllers.updatePostFromDB,
)

router.delete(
  '/:postId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.deletedPostFromDB,
)

router.post(
  '/post-comment/:postId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.commentPosFromDB,
)

router.delete(
  '/delete-comment/:postId/:commentId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.commentDeletFromDB,
)

router.put(
  '/update-comment/:postId/:commentId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.updateCommentFromDB,
)
router.put(
  '/:postId/vote',
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.votePost,
)

export const PostRoutes = router
