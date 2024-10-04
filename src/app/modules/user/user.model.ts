/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose, { model, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../../config'
import { IUserModel, TUser } from './user.interface'

const TUserSchema = new Schema<TUser, IUserModel>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Please fill a valid email address',
      ],
    },
    passwordChangedAt: {
      type: Date,
    },
    profession: { type: String, default: null },
    userName: { type: String, unique: true },
    password: { type: String, required: true, select: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    gender: { type: String, enum: ['male', 'female'], required: true },
    birthDate: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String, default: null },
    followers: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }],
    payments: [{ type: mongoose.Types.ObjectId, ref: 'Payment', default: [] }],
    bio: { type: String, default: '', trim: true },
    address: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    virtuals: true,
  },
)
// password hashing
TUserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this // doc
  // hashing password and save into DB
  // Generate userName from email before saving
  if (!user.userName && user.email) {
    const emailParts = user.email.split('@')
    user.userName = emailParts[0] // Take the part before the "@" symbol
  }

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_number),
  )

  next()
})

// set '' after saving password
TUserSchema.post('save', function (doc, next) {
  doc.password = ''
  next()
})

TUserSchema.statics.isUserExists = async function (email: string) {
  return await User.findOne({ email }).select('+password')
}

TUserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}

TUserSchema.statics.isJwtIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: number,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000

  return passwordChangedTime > jwtIssuedTimestamp
}

export const User = model<TUser, IUserModel>('User', TUserSchema)
