import type { AbonelikPlani, Abonelik, OdemeData } from '../types/subscription.types'
import type { ApiResponse } from '../types/api.types'
import { apiClient } from './client'

export const subscriptionsApi = {
  getPlans: () => apiClient.get<ApiResponse<AbonelikPlani[]>>('/subscriptions/plans'),

  getCurrent: () => apiClient.get<ApiResponse<Abonelik | null>>('/subscriptions/current'),

  subscribe: (data: OdemeData) =>
    apiClient.post<ApiResponse<Abonelik>>('/subscriptions/subscribe', data),

  cancel: () => apiClient.post<ApiResponse<null>>('/subscriptions/cancel'),

  changePlan: (planId: number) =>
    apiClient.put<ApiResponse<Abonelik>>('/subscriptions/change-plan', { planId }),
}
