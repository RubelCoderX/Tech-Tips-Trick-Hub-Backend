import mongoose, { model, Schema } from 'mongoose'
import { TPayment } from './payment.interface'

const paymentSchema = new Schema<TPayment>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    packageName: {
      type: String,
      required: true,
    },
    packagePrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'AamarPay',
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
)
export const PaymentModel = model<TPayment>('payment', paymentSchema)
