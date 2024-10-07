import httpStatus from 'http-status'
import AppError from '../../error/AppError'
import { TUser } from './user.interface'
import { User } from './user.model'
import mongoose from 'mongoose'

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
const getMeFromDB = async (email: string) => {
  const user = await User.isUserExists(email)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!')
  }

  return user
}
const toggleFollowUserIntoDB = async (
  followingId: string,
  followerEmail: string,
) => {
  const followingUser = await User.findById(followingId)
  const followerUser = await User.isUserExists(followerEmail)
  if (!followingUser || !followerUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }
  if (followingUser?.isDeleted || followerUser?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted')
  }
  const isFollowing = followingUser.followers.includes(
    new mongoose.Types.ObjectId(followerUser?._id),
  )
  if (isFollowing) {
    // unfollow the user
    await User.findByIdAndUpdate(
      followingUser?._id,
      { $pull: { following: followingUser?._id } },
      { new: true },
    )
    await User.findByIdAndUpdate(
      followingUser?._id,
      { $pull: { followers: followerUser?._id } },
      { new: true },
    )
    return null
  } else {
    // follow the user
    await User.findByIdAndUpdate(
      followerUser?._id,
      { $addToSet: { following: followingUser?._id } },
      { new: true },
    )
    await User.findByIdAndUpdate(
      followingUser?._id,
      { $addToSet: { followers: followerUser?._id } },
      { new: true },
    )
    return null
  }
}
const userManageStatus = async (id: string, action: 'block' | 'unblock') => {
  const user = await User.findById(id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }
  if (action === 'block') {
    if (user?.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User is deleted')
    }
    if (user?.status === 'block') {
      throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked')
    }
    const result = await User.findByIdAndUpdate(
      user._id,
      { status: 'block' },
      { new: true, runValidators: true },
    )

    return result
  } else if (action === 'unblock') {
    if (user?.status !== 'block') {
      throw new AppError(httpStatus.BAD_REQUEST, 'User is already active')
    }
    const result = await User.findByIdAndUpdate(
      user._id,
      { status: 'active' },
      { new: true, runValidators: true },
    )

    return result
  }
}
export const UserServices = {
  createUserIntoDB,
  getSingleUserIntoDB,
  getAllUsersIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
  getMeFromDB,
  toggleFollowUserIntoDB,
  userManageStatus,
}
