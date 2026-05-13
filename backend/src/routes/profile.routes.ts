import { Router } from 'express'
import { getStats, updateProfile, changePassword } from '../controllers/profile.controller.js'

export const profileRouter = Router()

profileRouter.get('/stats', getStats)
profileRouter.put('/', updateProfile)
profileRouter.put('/password', changePassword)
