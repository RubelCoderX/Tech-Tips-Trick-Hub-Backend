import mongoose, { Model } from 'mongoose'

export type TUser = {
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  gender: 'male' | 'female'
  birthDate: string
  isVerified: boolean
  profileImage?: string
  followers: mongoose.Types.ObjectId[]
  following: mongoose.Types.ObjectId[]
  payments: mongoose.Types.ObjectId[]
  verificationBadge?: string
  bio: string
  location: string
  isDeleted: boolean
  passwordChangedAt?: Date
}

export interface IUserModel extends Model<TUser> {
  isUserExists(email: string): Promise<TUser>
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): boolean
}
