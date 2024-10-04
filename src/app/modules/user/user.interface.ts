/* eslint-disable no-unused-vars */
import mongoose, { Model } from 'mongoose'
import { USER_ROLE } from './user.constant'

export type TUser = {
  name: string
  profession?: string
  userName?: string
  email: string
  password: string
  role: 'user' | 'admin'
  gender: 'male' | 'female'
  birthDate: Date
  isVerified: boolean
  profileImage?: string
  followers: mongoose.Types.ObjectId[]
  following: mongoose.Types.ObjectId[]
  payments: mongoose.Types.ObjectId[]
  passwordChangedAt: Date
  bio: string
  address?: string
  isDeleted: boolean
}

export interface IUserModel extends Model<TUser> {
  isUserExists(email: string): Promise<TUser>
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): boolean
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>
  isJwtIssuedBeforePasswordChanged(
    passwordChangedTimeStamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean
}
export type TUserRole = keyof typeof USER_ROLE
