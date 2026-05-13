import { Router } from 'express'
import {
  getPlans,
  getCurrentSubscription,
  subscribe,
  cancelSubscription,
  changePlan,
} from '../controllers/subscriptions.controller.js'

export const subscriptionsRouter = Router()

subscriptionsRouter.get('/plans', getPlans)
subscriptionsRouter.get('/current', getCurrentSubscription)
subscriptionsRouter.post('/subscribe', subscribe)
subscriptionsRouter.post('/cancel', cancelSubscription)
subscriptionsRouter.put('/change-plan', changePlan)
