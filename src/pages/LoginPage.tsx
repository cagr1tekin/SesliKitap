import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const loginSchema = z.object({
  eposta: z.string().email('Geçerli bir e-posta adresi girin'),
  sifre: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  beniHatirla: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoginLoading, loginError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data)
      navigate('/')
    } catch {
      // hata state'i loginError'da
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-base">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-400 mb-2">Sesli</h1>
          <p className="text-text-secondary">Hesabınıza giriş yapın</p>
        </div>

        <div className="bg-surface-raised rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              {...register('eposta')}
              type="email"
              id="eposta"
              label="E-posta"
              placeholder="ornek@mail.com"
              leftIcon={<Mail size={16} strokeWidth={1.75} />}
              error={errors.eposta?.message}
              autoComplete="email"
            />
            <Input
              {...register('sifre')}
              type="password"
              id="sifre"
              label="Şifre"
              placeholder="••••••••"
              leftIcon={<Lock size={16} strokeWidth={1.75} />}
              error={errors.sifre?.message}
              autoComplete="current-password"
            />

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('beniHatirla')}
                type="checkbox"
                className="w-4 h-4 accent-teal-500"
              />
              <span className="text-sm text-text-secondary">Beni hatırla</span>
            </label>

            {loginError && (
              <p className="text-sm text-red-400 text-center">
                E-posta veya şifre hatalı. Tekrar deneyin.
              </p>
            )}

            <Button type="submit" disabled={isLoginLoading} className="w-full mt-2">
              {isLoginLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Hesabınız yok mu?{' '}
            <Link to="/kayit" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
              Üye olun
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
