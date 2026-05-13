import { useParams, useNavigate } from 'react-router-dom'
import { Play, Heart, Star, Clock, ArrowLeft } from 'lucide-react'
import { useBook, useBookReviews } from '@/hooks/useBooks'
import { usePlayer } from '@/hooks/usePlayer'
import { useAuthStore } from '@/store/authStore'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { StarRating } from '@/components/ui/StarRating'
import { formatSureOkunabilir, formatTarih, formatFiyat } from '@/utils/formatters'

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const kitapId = Number(id)
  const { data: kitap, isLoading } = useBook(kitapId)
  const { data: degerlendirmeler } = useBookReviews(kitapId)
  const { play } = usePlayer()
  const { isAuthenticated } = useAuthStore()

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="animate-pulse flex flex-col gap-6">
          <div className="h-8 w-32 bg-surface-raised rounded-xl" />
          <div className="flex gap-6">
            <div className="w-48 h-64 bg-surface-raised rounded-2xl shrink-0" />
            <div className="flex-1 flex flex-col gap-4">
              <div className="h-8 bg-surface-raised rounded-xl" />
              <div className="h-4 w-48 bg-surface-raised rounded-xl" />
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!kitap) {
    return (
      <PageWrapper>
        <p className="text-text-secondary">Kitap bulunamadı.</p>
      </PageWrapper>
    )
  }

  const handlePlay = () => {
    if (!isAuthenticated) { navigate('/giris'); return }
    play(kitap)
  }

  return (
    <PageWrapper>
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6">
        <ArrowLeft size={18} strokeWidth={1.75} />
        <span className="text-sm font-medium">Geri</span>
      </button>

      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="shrink-0 flex flex-col items-center md:items-start gap-4">
          <div className="w-48 h-64 md:w-56 md:h-72 rounded-2xl bg-surface-raised flex items-center justify-center">
            <p className="text-text-secondary text-sm text-center px-4 font-medium">{kitap.baslik}</p>
          </div>
          <div className="flex gap-2 w-full md:w-56">
            <Button onClick={handlePlay} className="flex-1 gap-2">
              <Play size={16} strokeWidth={1.75} className="ml-0.5" />
              Dinle
            </Button>
            <button aria-label="Favorilere ekle"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-overlay hover:bg-teal-500/10 text-text-secondary hover:text-red-400 transition-colors">
              <Heart size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <div>
            <Chip className="mb-3">{kitap.kategori.kategoriAdi}</Chip>
            <h1 className="text-3xl font-bold text-text-primary mb-1">{kitap.baslik}</h1>
            <p className="text-lg text-text-secondary">{kitap.yazar.ad} {kitap.yazar.soyad}</p>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-sm text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Star size={16} strokeWidth={1.75} className="text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-text-primary">{Number(kitap.ortalamaPuan).toFixed(1)}</span>
              <span>({kitap.degerlendirmeSayisi} değerlendirme)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} strokeWidth={1.75} />
              {formatSureOkunabilir(kitap.sure)}
            </div>
            {kitap.dil && <span>{kitap.dil}</span>}
          </div>

          <p className="text-xl font-bold text-teal-400">{formatFiyat(kitap.ucret)}</p>

          {kitap.yazar.biyografi && (
            <div className="bg-surface-raised rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-2">Yazar Hakkında</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{kitap.yazar.biyografi}</p>
              {kitap.yazar.uyruk && (
                <p className="text-xs text-text-tertiary mt-2">Uyruk: {kitap.yazar.uyruk}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {degerlendirmeler && degerlendirmeler.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-text-primary mb-4">Değerlendirmeler</h2>
          <div className="flex flex-col gap-4">
            {degerlendirmeler.map((d) => (
              <div key={d.id} className="bg-surface-raised rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-primary">{d.kullanici.ad}</span>
                  <div className="flex items-center gap-2">
                    <StarRating value={d.puan} />
                    <span className="text-xs text-text-tertiary">{formatTarih(d.tarih)}</span>
                  </div>
                </div>
                {d.yorum && <p className="text-sm text-text-secondary">{d.yorum}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </PageWrapper>
  )
}
