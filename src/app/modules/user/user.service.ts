import httpStatus from 'http-status'
import AppError from '../../error/AppError'
import { TUser } from './user.interface'
import { User } from './user.model'

// create user
const createUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload)
  return result
}
// get single user
const getSingleUserIntoDB = async (id: string) => {
  const user = await User.findById(id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }
  return user
}
// get all users
const getAllUsersIntoDB = async () => {
  const users = await User.find()
  return users
}
// update user
const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
  const user = await User.findById(id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }
  const updatedUser = await User.findOneAndUpdate({ _id: id }, payload, {
    runValidators: true,
    new: true,
  })
  return updatedUser
}
// delete user
const deleteUserIntoDB = async (id: string) => {
  const user = await User.findById(id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }
  const deletedUser = await User.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true },
  )
  return deletedUser
}
export const UserServices = {
  createUserIntoDB,
  getSingleUserIntoDB,
  getAllUsersIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
}
