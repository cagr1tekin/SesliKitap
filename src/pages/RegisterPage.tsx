import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const registerSchema = z
  .object({
    ad: z.string().min(2, 'Ad en az 2 karakter olmalı'),
    soyad: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
    eposta: z.string().email('Geçerli bir e-posta adresi girin'),
    sifre: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
    sifreTekrar: z.string(),
  })
  .refine((data) => data.sifre === data.sifreTekrar, {
    message: 'Şifreler eşleşmiyor',
    path: ['sifreTekrar'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isRegisterLoading, registerError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({ ad: data.ad, soyad: data.soyad, eposta: data.eposta, sifre: data.sifre })
      navigate('/')
    } catch {
      // hata state'i registerError'da
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-base">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-400 mb-2">Sesli</h1>
          <p className="text-text-secondary">Yeni hesap oluşturun</p>
        </div>

        <div className="bg-surface-raised rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                {...register('ad')}
                id="ad"
                label="Ad"
                placeholder="Ahmet"
                leftIcon={<User size={16} strokeWidth={1.75} />}
                error={errors.ad?.message}
                autoComplete="given-name"
              />
              <Input
                {...register('soyad')}
                id="soyad"
                label="Soyad"
                placeholder="Yılmaz"
                error={errors.soyad?.message}
                autoComplete="family-name"
              />
            </div>
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
              placeholder="En az 8 karakter"
              leftIcon={<Lock size={16} strokeWidth={1.75} />}
              error={errors.sifre?.message}
              autoComplete="new-password"
            />
            <Input
              {...register('sifreTekrar')}
              type="password"
              id="sifreTekrar"
              label="Şifre Tekrar"
              placeholder="Şifreyi tekrar girin"
              leftIcon={<Lock size={16} strokeWidth={1.75} />}
              error={errors.sifreTekrar?.message}
              autoComplete="new-password"
            />

            {registerError && (
              <p className="text-sm text-red-400 text-center">
                Kayıt oluşturulamadı. Lütfen tekrar deneyin.
              </p>
            )}

            <Button type="submit" disabled={isRegisterLoading} className="w-full mt-2">
              {isRegisterLoading ? 'Hesap oluşturuluyor...' : 'Üye Ol'}
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Zaten hesabınız var mı?{' '}
            <Link to="/giris" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
