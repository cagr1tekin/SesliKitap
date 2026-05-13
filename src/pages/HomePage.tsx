import { useNavigate } from 'react-router-dom'
import { Headphones, Zap, BookOpen } from 'lucide-react'
import { BookCarousel } from '@/components/book/BookCarousel'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { usePlayer } from '@/hooks/usePlayer'
import { useBooks } from '@/hooks/useBooks'
import { useAuthStore } from '@/store/authStore'
import type { Kitap } from '@/types/book.types'

export function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { play } = usePlayer()

  const { data: yeniKitaplar } = useBooks({ siralama: 'enYeni', limit: 10 })
  const { data: populerKitaplar } = useBooks({ siralama: 'enCokDinlenen', limit: 10 })
  const { data: puranliKitaplar } = useBooks({ siralama: 'enYuksekPuanli', limit: 10 })

  const handlePlay = (kitap: Kitap) => {
    if (!isAuthenticated) {
      navigate('/giris')
      return
    }
    play(kitap)
  }

  return (
    <>
      {!isAuthenticated ? (
        <div className="bg-surface-base">
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center gap-8">
            <div className="flex flex-col gap-4 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
                Türkçe Sesli Kitap{' '}
                <span className="text-teal-400">Keyfini</span>{' '}
                Yaşa
              </h1>
              <p className="text-lg text-text-secondary">
                Binlerce Türkçe sesli kitaba erişin. İstediğiniz zaman, istediğiniz yerde dinleyin.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button onClick={() => navigate('/kayit')} size="lg">
                Ücretsiz Başla
              </Button>
              <Button onClick={() => navigate('/katalog')} variant="secondary" size="lg">
                Kataloğu Gez
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-8 max-w-lg w-full">
              {[
                { icon: BookOpen, label: '10.000+', desc: 'Sesli Kitap' },
                { icon: Headphones, label: '500K+', desc: 'Dinleyici' },
                { icon: Zap, label: '10 Kategori', desc: 'Türce İçerik' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon size={28} strokeWidth={1.5} className="text-teal-400" />
                  <p className="text-xl font-bold text-text-primary">{label}</p>
                  <p className="text-xs text-text-secondary">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-base px-6 py-8 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Hoş geldin, {user?.ad} 👋
          </h1>
          <p className="text-text-secondary mb-8">Bugün ne dinlemek istersin?</p>
        </div>
      )}

      <PageWrapper>
        <div className="flex flex-col gap-12">
          {yeniKitaplar?.data && yeniKitaplar.data.length > 0 && (
            <BookCarousel
              title="Yeni Gelenler"
              books={yeniKitaplar.data}
              onPlay={handlePlay}
              seeAllHref="/katalog?siralama=enYeni"
            />
          )}
          {populerKitaplar?.data && populerKitaplar.data.length > 0 && (
            <BookCarousel
              title="En Çok Dinlenenler"
              books={populerKitaplar.data}
              onPlay={handlePlay}
              seeAllHref="/katalog?siralama=enCokDinlenen"
            />
          )}
          {puranliKitaplar?.data && puranliKitaplar.data.length > 0 && (
            <BookCarousel
              title="En Yüksek Puanlılar"
              books={puranliKitaplar.data}
              onPlay={handlePlay}
              seeAllHref="/katalog?siralama=enYuksekPuanli"
            />
          )}

          {!yeniKitaplar?.data?.length && !populerKitaplar?.data?.length && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <BookOpen size={48} strokeWidth={1.5} className="text-text-tertiary" />
              <p className="text-text-secondary">
                Henüz kitap yüklenmedi. Backend bağlantısı kurulduğunda içerikler burada görünecek.
              </p>
              <Button onClick={() => navigate('/katalog')} variant="secondary">
                Kataloğu Gez
              </Button>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  )
}
