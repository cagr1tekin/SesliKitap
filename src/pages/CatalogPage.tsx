import { useState } from 'react'
import { Search, LayoutGrid, List } from 'lucide-react'
import { useBooks } from '@/hooks/useBooks'
import { usePlayer } from '@/hooks/usePlayer'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BookCard } from '@/components/book/BookCard'
import { BookRow } from '@/components/book/BookRow'
import { Chip } from '@/components/ui/Chip'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { KATEGORILER } from '@/utils/constants'
import type { KitapListParams, KategoriAdi } from '@/types/book.types'

type Siralama = KitapListParams['siralama']
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ViewMode = 'grid' | 'list'

const SIRALAMA_SECENEKLERI: { value: Siralama; label: string }[] = [
  { value: 'enYeni', label: 'En Yeni' },
  { value: 'enCokDinlenen', label: 'En Popüler' },
  { value: 'enYuksekPuanli', label: 'En Puanlı' },
  { value: 'ucret', label: 'Fiyat' },
]

export function CatalogPage() {
  const [arama, setArama] = useState('')
  const [aktifKategori, setAktifKategori] = useState<KategoriAdi | null>(null)
  const [siralama, setSiralama] = useState<Siralama>('enYeni')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const { play } = usePlayer()

  const { data, isLoading } = useBooks({
    arama: arama || undefined,
    siralama,
  })

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-3xl font-bold text-text-primary">Katalog</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid görünümü"
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-teal-500/20 text-teal-400' : 'text-text-tertiary hover:text-text-primary hover:bg-surface-overlay'}`}
            >
              <LayoutGrid size={18} strokeWidth={1.75} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="Liste görünümü"
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${viewMode === 'list' ? 'bg-teal-500/20 text-teal-400' : 'text-text-tertiary hover:text-text-primary hover:bg-surface-overlay'}`}
            >
              <List size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <Input
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          placeholder="Kitap, yazar veya ISBN ara..."
          leftIcon={<Search size={16} strokeWidth={1.75} />}
        />

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          <Chip active={!aktifKategori} onClick={() => setAktifKategori(null)}>
            Tümü
          </Chip>
          {KATEGORILER.map((kat) => (
            <Chip
              key={kat}
              active={aktifKategori === kat}
              onClick={() => setAktifKategori(aktifKategori === kat ? null : kat)}
              className="shrink-0"
            >
              {kat}
            </Chip>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {SIRALAMA_SECENEKLERI.map((s) => (
            <button
              key={s.value}
              onClick={() => setSiralama(s.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${siralama === s.value ? 'bg-teal-500 text-white' : 'text-text-secondary hover:text-text-primary bg-surface-overlay hover:bg-surface-raised'}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                : 'flex flex-col gap-3'
            }
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`bg-surface-raised rounded-2xl animate-pulse ${viewMode === 'grid' ? 'aspect-[3/5]' : 'h-28'}`}
              />
            ))}
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            title="Kitap bulunamadı"
            description="Arama kriterlerinize uygun kitap yok. Farklı bir arama deneyin."
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data.data.map((kitap) => (
              <BookCard key={kitap.id} book={kitap} onPlay={play} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.data.map((kitap) => (
              <BookRow key={kitap.id} book={kitap} onPlay={play} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
