/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
/* eslint-disable @typescript-eslint/no-unused-vars */

import config from '../../config'

export const generateUniqueId = async () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')

  const timestamp = Date.now()

  const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let result = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters[randomIndex]
    }
    return result
  }

  const randomString = generateRandomString(6)

  const uniqueId = `PR-${year}${month}-${timestamp}-${randomString}`

  return uniqueId
}

export const initiatePayment = async (payload: any) => {
  const payloadData = encodeURIComponent(JSON.stringify(payload))

  const response = await axios.post(config.payment_url!, {
    store_id: config.store_id,
    signature_key: config.signature_key,
    tran_id: payload.transactionId,
    success_url: `${config.backend_url}/api/v1/payment/confirmation?transactionId=${payload.transactionId}&status=success&payloadData=${payloadData}`,
    fail_url: `${config.backend_url}/api/v1/payment/confirmation?transactionId=${payload.transactionId}&status=failed`,
    cancel_url: `${config.client_url}`,
    amount: payload.price,
    currency: 'BDT',
    desc: 'Merchant Registration Payment',
    cus_name: payload?.userName,
    cus_email: payload?.email,
    cus_add1: payload?.address,
    cus_add2: payload?.address,
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1206',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    type: 'json',
  })

  return response.data
}

export const verifyPayment = async (tnxId: string | undefined) => {
  try {
    const response = await axios.get(config.payment_verify_url!, {
      params: {
        store_id: config.store_id,
        signature_key: config.signature_key,
        type: 'json',
        request_id: tnxId,
      },
    })

    return response.data
  } catch (err) {
    throw new Error('Payment validation failed!')
  }
}

export function calculateExpiryDate(expiry: string) {
  const currentDate = new Date()

  if (expiry === '1 Week') {
    return new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString()
  } else if (expiry === '2 Days') {
    return new Date(
      currentDate.getTime() + 2 * 24 * 60 * 60 * 1000,
    ).toISOString()
  } else if (expiry === '1 Month') {
    currentDate.setMonth(currentDate.getMonth() + 1)
    return currentDate.toISOString()
  } else {
    return expiry
  }
}
