import express from 'express'

import validateRequest from '../../middleware/validRequest'
import { createUserSchema } from './user.validation'
import { UserControllers } from './user.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from './user.constant'

const router = express.Router()

router.post(
  '/create-user',

  validateRequest(createUserSchema),

  UserControllers.createUserFromDB,
)
router.get(
  '/get-me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getMe,
)

router.get('/get-single-user/:id', UserControllers.getSingleUserFromDB)
router.get('/', auth(USER_ROLE.user), UserControllers.getAllUserFromDB)
router.put('/update-user/:id', UserControllers.updateUserFromDB)
router.delete('/delete-user/:id', UserControllers.deleteUserFromDB)

export const UserRoutes = router
