import express from 'express'

import validateRequest from '../../middleware/validRequest'
import {
  loginValidationSchema,
  refreshTokenValidationSchema,
} from '../user/user.validation'
import { AuthController } from './auth.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.post(
  '/sign-in',
  validateRequest(loginValidationSchema),
  AuthController.createLoginUserIntoDB,
)
router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  AuthController.createChangePasswordIntoDB,
)
router.post(
  '/refresh-token',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(refreshTokenValidationSchema),
  AuthController.refreshToken,
)
router.post('/forget-password', AuthController.forgetPasswordFromDB)

export const AuthRoutes = router
