import { Types } from 'mongoose'
import { TUser } from '../user/user.interface'

export type TPayment = {
  user: Types.ObjectId
  packageName: string
  packagePrice: number
  paymentMethod: string
  transactionId: string
  status: 'pending' | 'completed' | 'failed'
  expiryDate: Date
}
export interface PaymentData {
  user: string
  title: string
  price: string
  expiry: string
  transactionId: string
  isUserExist: TUser | null
}
