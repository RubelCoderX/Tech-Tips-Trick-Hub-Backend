import httpStatus from 'http-status'
import AppError from '../../error/AppError'
import { User } from '../user/user.model'
import { TUserLogin } from './auth.interface'
import { createToken, verifyToken } from './auth.utils'
import config from '../../config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { sendEmail } from '../../utils/sendMail'

const createLoginUser = async (payload: TUserLogin) => {
  const user = await User.isUserExists(payload.email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }
  // user is deleted
  const userAlreadyDeleted = user?.isDeleted
  if (userAlreadyDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already deleted')
  }
  // check if password is correct
  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user?.password,
  )

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password is incorrect')
  }
  const jwtPayload = {
    userId: user?.id,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    name: user.name,
    userName: user.userName,
  }
  // create token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )
  // refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  )
  return {
    accessToken,
    refreshToken,
  }
}
// create change password
const createChangePassword = async (
  payload: { oldPassword: string; newPassword: string },
  userData: JwtPayload,
) => {
  const user = await User.isUserExists(userData.email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is not Found')
  }
  // checking is the user is already soft deleted

  const isDeleted = user?.isDeleted
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted')
  }

  // checking if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched !')
  }
  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_number),
  )
  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
    {
      new: true,
    },
  )
}
const createRefreshToken = async (token: string) => {
  // check if the token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string)

  const { email, iat } = decoded
  // check if the user exists
  const user = await User.isUserExists(email)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }
  const userAlreadyDeleted = user?.isDeleted
  if (userAlreadyDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already deleted')
  }
  // check if jwt issued before password changed
  if (
    user.passwordChangedAt &&
    User.isJwtIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Your password has been changed',
    )
  }

  const jwtPayload = {
    id: user?._id,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
  }
  // create token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )
  return { accessToken }
}
const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await User.findOne({ email })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !')
  }

  const jwtPayload = {
    id: user?._id,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
  }

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  const resetUILink = `${config.reset_pass_ui_link}?eamil=${user.email}&token=${resetToken} `

  sendEmail(user.email, resetUILink)
}
const resetPassword = async (
  payload: {
    email: string
    newPassword: string
  },
  token: string,
) => {
  //checking if the user is exists
  const user = await User.isUserExists(payload?.email)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found!!')
  }
  // checking if the user is deleted
  const isDeleted = user.isDeleted
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted!!')
  }
  // checking if the user is blocked
  const userStatus = user?.status
  if (userStatus === 'block') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already blocked!!')
  }
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload

  if (payload.email !== decoded.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You ar forbidden!!')
  }
  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_number),
  )
  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      passwordChangesAt: new Date(),
    },
  )
}
const toggoleUserRole = async (userId: string) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already deleted')
  }
  if (user.status === 'block') {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked')
  }
  const updateRole = user.role === 'user' ? 'admin' : 'user'
  const updateUserRole = await User.findByIdAndUpdate(
    userId,
    { role: updateRole },
    { new: true },
  )
  return updateUserRole
}

export const AuthService = {
  createLoginUser,
  createChangePassword,
  createRefreshToken,
  forgetPassword,
  resetPassword,
  toggoleUserRole,
}
