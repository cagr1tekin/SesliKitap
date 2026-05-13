import type { User, ListeningStats } from '../types/user.types'
import type { ApiResponse } from '../types/api.types'
import { apiClient } from './client'

export const profileApi = {
  getStats: () => apiClient.get<ApiResponse<ListeningStats>>('/profile/stats'),

  update: (data: Partial<Pick<User, 'ad' | 'soyad'>>) =>
    apiClient.put<ApiResponse<User>>('/profile', data),

  uploadPhoto: (file: File) => {
    const form = new FormData()
    form.append('photo', file)
    return apiClient.post<ApiResponse<{ url: string }>>('/profile/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  changePassword: (data: { mevcutSifre: string; yeniSifre: string }) =>
    apiClient.put<ApiResponse<null>>('/profile/password', data),
}
