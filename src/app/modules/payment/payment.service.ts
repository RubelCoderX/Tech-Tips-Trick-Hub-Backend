import httpStatus from 'http-status'
import AppError from '../../error/AppError'
import { User } from '../user/user.model'
import { TPayment } from './payment.interface'
import { PaymentModel } from './payment.model'

import {
  calculateExpiryDate,
  generateUniqueId,
  initiatePayment,
  verifyPayment,
} from './payment.utils'
import { join } from 'path'
import { readFileSync } from 'fs'

const createPaymentIntoDB = async (payload: TPayment) => {
  const isUserExist = await User.findById(payload.user)

  const newTransactionId = await generateUniqueId()

  if (isUserExist && newTransactionId) {
    const paymentData = {
      ...payload,
      transactionId: newTransactionId,
      userName: isUserExist?.userName,
      email: isUserExist?.email,
      phoneNumber: isUserExist?.phoneNumber || '017564554812',
      address: isUserExist?.address || 'Dhaka',
    }
    // console.log('paymentData:', paymentData)
    const paymentSession = await initiatePayment(paymentData)

    return paymentSession
  }
}

const getAllPaymentIntoDB = async () => {
  const result = await PaymentModel.find().populate('user')
  return result
}

const getSinglePaymentIntoDB = async (paymentId: string) => {
  const payment = await PaymentModel.findById(paymentId)
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found!')
  }
  return payment
}

const confirmationServiceIntoDB = async (
  transactionId?: string | undefined,
  status?: string,
  payloadData?: string,
) => {
  let message = ''
  let parsedPaymentData

  try {
    const res = await verifyPayment(transactionId)
    if (!res || res.pay_status !== 'Successful') {
      throw new Error('Payment verification failed or was not successful.')
    }

    if (res) {
      try {
        parsedPaymentData =
          typeof payloadData === 'string'
            ? JSON.parse(payloadData)
            : payloadData
      } catch (error) {
        throw new Error('Invalid JSON format in payment data')
      }

      if (
        !parsedPaymentData.user ||
        !parsedPaymentData.title ||
        !parsedPaymentData.price ||
        !parsedPaymentData.transactionId ||
        !parsedPaymentData.expiry
      ) {
        throw new Error('Missing required payment data fields.')
      }
    }

    const paymentInfo = {
      user: parsedPaymentData?.user,
      transactionId: transactionId,
      packageName: parsedPaymentData?.title,
      packagePrice: parsedPaymentData?.price,
      status: res.pay_status === 'Successful' ? 'completed' : 'failed',
      expiryDate: calculateExpiryDate(parsedPaymentData?.expiry),
    }

    if (res?.pay_status === 'Successful') {
      await User.findByIdAndUpdate(
        {
          _id: parsedPaymentData?.user,
        },
        {
          isVerified: true,

          subscriptions: paymentInfo?.packageName,
        },
        { new: true },
      )

      await PaymentModel.create(paymentInfo)

      message = 'Payment successful'

      const filePath = join(__dirname, '../../../../public/confirmation.html')
      let template = readFileSync(filePath, 'utf-8')
      template = template.replace('{{message}}', message)
      return template
    } else {
      throw new Error('Payment validation failed.')
    }
  } catch (error) {
    message = 'Payment failed'
    const filePath = join(__dirname, '../../../../public/faildpayment.html')
    let template
    try {
      template = readFileSync(filePath, 'utf-8')
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error!',
      )
    }
    template = template.replace('{{message}}', message)
    return template
  }
}
export const PaymentService = {
  createPaymentIntoDB,
  getAllPaymentIntoDB,
  getSinglePaymentIntoDB,
  confirmationServiceIntoDB,
}
