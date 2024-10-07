import httpStatus from 'http-status'
import config from '../../config'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthService } from './auth.services'

const createLoginUserIntoDB = catchAsync(async (req, res) => {
  const result = await AuthService.createLoginUser(req.body)
  const { accessToken, refreshToken } = result
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_dev === 'production',
    httpOnly: true,
  })

  sendResponse(res, {
    success: true,
    message: 'User logged in successfully',
    statusCode: httpStatus.OK,
    data: { accessToken, refreshToken },
  })
})

const createChangePasswordIntoDB = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body
  const result = await AuthService.createChangePassword(passwordData, req.user)

  sendResponse(res, {
    success: true,
    message: 'Password changed successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies
  const result = await AuthService.createRefreshToken(refreshToken)
  sendResponse(res, {
    success: true,
    message: 'Token refreshed successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const forgetPasswordFromDB = catchAsync(async (req, res) => {
  const { email } = req.body
  const result = await AuthService.forgetPassword(email)
  sendResponse(res, {
    success: true,
    message: 'Reset password link sent to your email',
    statusCode: httpStatus.OK,
    data: result,
  })
})
const toggoleUserRoleFromDB = catchAsync(async (req, res) => {
  const { userId } = req.params
  const result = await AuthService.toggoleUserRole(userId)
  sendResponse(res, {
    success: true,
    message: 'User role toggled successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})
export const AuthController = {
  createLoginUserIntoDB,
  createChangePasswordIntoDB,
  refreshToken,
  forgetPasswordFromDB,
  toggoleUserRoleFromDB,
}
