import { useNavigate } from 'react-router-dom'
import { Camera, Clock, BookCheck, Headphones } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Avatar } from '@/components/ui/Avatar'
import { formatSureOkunabilir } from '@/utils/formatters'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    navigate('/giris')
    return null
  }

  const mockStats = {
    toplamSure: 43200,
    tamamlananKitap: 12,
    enCokDinlenenKategori: 'Roman',
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar
              src={user.profilFoto}
              alt={`${user.ad} ${user.soyad}`}
              size="lg"
              className="w-24 h-24 text-2xl"
            />
            <button
              aria-label="Profil fotoğrafı değiştir"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-teal-500 hover:bg-teal-600 flex items-center justify-center text-white transition-colors"
            >
              <Camera size={14} strokeWidth={1.75} />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary">
              {user.ad} {user.soyad}
            </h1>
            <p className="text-text-secondary text-sm">{user.eposta}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: Clock,
              label: 'Toplam Süre',
              value: formatSureOkunabilir(mockStats.toplamSure),
            },
            {
              icon: BookCheck,
              label: 'Tamamlanan',
              value: `${mockStats.tamamlananKitap} kitap`,
            },
            {
              icon: Headphones,
              label: 'Favori Tür',
              value: mockStats.enCokDinlenenKategori,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-surface-raised rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
            >
              <Icon size={24} strokeWidth={1.5} className="text-teal-400" />
              <p className="text-lg font-bold text-text-primary">{value}</p>
              <p className="text-xs text-text-secondary">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {[
            { label: 'Dinleme Geçmişi', href: '/gecmis' },
            { label: 'Favorilerim', href: '/favoriler' },
            { label: 'Değerlendirmelerim', href: '/degerlendirmeler' },
            { label: 'Abonelik', href: '/planlar' },
          ].map(({ label, href }) => (
            <button
              key={label}
              onClick={() => navigate(href)}
              className="flex items-center justify-between bg-surface-raised rounded-2xl px-5 py-4 hover:bg-surface-overlay transition-colors text-left"
            >
              <span className="text-sm font-medium text-text-primary">{label}</span>
              <span className="text-text-tertiary">›</span>
            </button>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
