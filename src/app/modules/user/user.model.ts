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
    password: { type: String, required: true, select: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    gender: { type: String, enum: ['male', 'female'], required: true },
    birthDate: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String, default: null },
    followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    payments: [{ type: mongoose.Types.ObjectId, ref: 'Payment' }],
    verificationBadge: { type: String, default: null },
    bio: { type: String, default: null },
    location: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    virtuals: true,
  },
)
// password hashing
TUserSchema.pre('save', async function (next) {
  const user = this
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_number),
  )
  next()
})
// Static method to check if a user exists by custom ID
TUserSchema.statics.isUserExists = async function (id: string) {
  return await User.findOne({ id }).select('+password')
}
export const User = model<TUser, IUserModel>('User', TUserSchema)
