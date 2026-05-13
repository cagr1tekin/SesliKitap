import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken =
        localStorage.getItem('refreshToken') ?? sessionStorage.getItem('refreshToken')

      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken })
          const { accessToken } = data as { accessToken: string }
          localStorage.setItem('accessToken', accessToken)
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          sessionStorage.removeItem('accessToken')
          sessionStorage.removeItem('refreshToken')
          window.location.href = '/giris'
        }
      }
    }

    return Promise.reject(error)
  },
)
