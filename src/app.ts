import express, { Request, Response } from 'express'
import router from './app/routes'
import cors from 'cors'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import notFound from './app/middleware/notFound'
import cookieParser from 'cookie-parser'
import config from './app/config'

const app = express()

//parser
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: [config.client_url as string],
  }),
)
//application route
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
  res.send('Welcom to Simple Assignment 6!')
})

app.use(globalErrorHandler)
//not found
app.use(notFound)
export default app
