import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth.api'
import type { LoginCredentials, RegisterData } from '@/types/user.types'

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    const token =
      localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken')
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then(({ data }) => setUser(data.data))
      .catch(() => {
        logout()
        setLoading(false)
      })
  }, [setUser, setLoading, logout])

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: ({ data }, variables) => {
      const storage = variables.beniHatirla ? localStorage : sessionStorage
      storage.setItem('accessToken', data.data.accessToken)
      storage.setItem('refreshToken', data.data.refreshToken)
      setUser(data.data.user)
    },
  })

  const registerMutation = useMutation({
    mutationFn: (registerData: RegisterData) => authApi.register(registerData),
    onSuccess: ({ data }) => {
      sessionStorage.setItem('accessToken', data.data.accessToken)
      sessionStorage.setItem('refreshToken', data.data.refreshToken)
      setUser(data.data.user)
    },
  })

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  }
}
