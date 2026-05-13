import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth.routes.js'
import { booksRouter } from './routes/books.routes.js'
import { subscriptionsRouter } from './routes/subscriptions.routes.js'
import { profileRouter } from './routes/profile.routes.js'
import { authMiddleware } from './middleware/auth.middleware.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/books', authMiddleware, booksRouter)
app.use('/api/subscriptions', authMiddleware, subscriptionsRouter)
app.use('/api/profile', authMiddleware, profileRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.info(`Sesli API sunucusu http://localhost:${PORT} üzerinde çalışıyor`)
})
