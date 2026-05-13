import type { AuthTokens, LoginCredentials, RegisterData, User } from '../types/user.types'
import type { ApiResponse } from '../types/api.types'
import { apiClient } from './client'

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<ApiResponse<AuthTokens & { user: User }>>('/auth/login', credentials),

  register: (data: RegisterData) =>
    apiClient.post<ApiResponse<AuthTokens & { user: User }>>('/auth/register', data),

  logout: () => apiClient.post<ApiResponse<null>>('/auth/logout'),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken }),

  me: () => apiClient.get<ApiResponse<User>>('/auth/me'),
}
