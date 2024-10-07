import { Router } from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { AuthRoutes } from '../modules/auth/auth.route'
import { PostRoutes } from '../modules/post/post.route'
import { PaymentRoute } from '../modules/payment/payment.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/post',
    route: PostRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoute,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router
