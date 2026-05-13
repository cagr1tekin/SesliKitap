import { Router } from 'express'
import { login, register, refreshToken, me } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.post('/refresh', refreshToken)
authRouter.get('/me', authMiddleware, me)
