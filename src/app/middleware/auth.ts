import httpStatus from 'http-status'

import catchAsync from '../utils/catchAsync'
import config from '../config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { TUserRole } from '../modules/user/user.interface'
import AppError from '../error/AppError'
import { User } from '../modules/user/user.model'

const auth = (...userRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    let decoded
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    const { email, role, iat } = decoded

    const existingUser = await User.isUserExists(email)
    if (!existingUser) {
      throw new AppError(httpStatus.FORBIDDEN, 'Forbidden access!')
    }

    if (
      existingUser.passwordChangedAt &&
      User.isJwtIssuedBeforePasswordChanged(
        existingUser.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!')
    }

    if (userRoles && !userRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route!',
      )
    }

    req.user = decoded

    next()
  })
}

export default auth
