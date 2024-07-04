import express from 'express'
const app = express()

app.get('/', (req, res) => {
  res.send('Welcome BuyBazzar Shop!')
})

export default app
