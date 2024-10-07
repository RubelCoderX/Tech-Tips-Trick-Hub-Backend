import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { UserServices } from './user.service'

const createUserFromDB = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users Retrieved Successfully',
    data: result,
  })
})
const getSingleUserFromDB = catchAsync(async (req, res) => {
  const result = await UserServices.getSingleUserIntoDB(req.params.id)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users Retrieved Successfully',
    data: result,
  })
})
const getMe = catchAsync(async (req, res) => {
  const email = req.user.email
  const result = await UserServices.getMeFromDB(email)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile data fetched successfully!',
    data: result,
  })
})

const getAllUserFromDB = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersIntoDB()
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users Retrieved Successfully',
    data: result,
  })
})
const updateUserFromDB = catchAsync(async (req, res) => {
  const result = await UserServices.updateUserIntoDB(req.params.id, req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users Updated Successfully',
    data: result,
  })
})
const deleteUserFromDB = catchAsync(async (req, res) => {
  const result = await UserServices.deleteUserIntoDB(req.params.id)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users Deleted Successfully',
    data: result,
  })
})
const toggleFollowFromDB = catchAsync(async (req, res) => {
  const followingId = req.params.id

  const followerEmail = req.user.email

  const result = await UserServices.toggleFollowUserIntoDB(
    followingId,
    followerEmail,
  )
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Follow Action Successfully',
    data: result,
  })
})
const userManageStatusFromDB = catchAsync(async (req, res) => {
  const id = req.params.id

  const action: 'unblock' | 'block' = req.query.action as 'unblock' | 'block'

  const result = await UserServices.userManageStatus(id, action)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User status updated successfully',
    data: result,
  })
})

export const UserControllers = {
  createUserFromDB,
  getSingleUserFromDB,
  getAllUserFromDB,
  updateUserFromDB,
  deleteUserFromDB,
  getMe,
  toggleFollowFromDB,
  userManageStatusFromDB,
}
