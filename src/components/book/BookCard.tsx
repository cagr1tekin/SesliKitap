import { Play, Star } from 'lucide-react'
import type { Kitap } from '@/types/book.types'
import { formatSureOkunabilir, formatFiyat } from '@/utils/formatters'
import { cn } from '@/utils/cn'

interface BookCardProps {
  book: Kitap
  onPlay: (book: Kitap) => void
  showProgress?: boolean
  progressSaniye?: number
  className?: string
}

export function BookCard({
  book,
  onPlay,
  showProgress = false,
  progressSaniye = 0,
  className,
}: BookCardProps) {
  const progressYuzde = book.sure > 0 ? Math.min(100, (progressSaniye / book.sure) * 100) : 0

  return (
    <div className={cn('group bg-surface-raised rounded-2xl p-4 hover:bg-surface-overlay transition-colors cursor-pointer', className)}>
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-surface-sunken flex items-center justify-center">
        <div className="text-text-tertiary text-center px-2">
          <div className="text-xs font-medium text-text-secondary line-clamp-3">{book.baslik}</div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onPlay(book) }}
          aria-label={`${book.baslik} kitabını oynat`}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center">
            <Play size={20} strokeWidth={1.75} className="text-white ml-0.5" />
          </div>
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug">
          {book.baslik}
        </h3>
        <p className="text-xs text-text-secondary">
          {book.yazar.ad} {book.yazar.soyad}
        </p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <Star size={12} strokeWidth={1.75} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-text-secondary">{Number(book.ortalamaPuan).toFixed(1)}</span>
          </div>
          <span className="text-xs text-text-tertiary">{formatSureOkunabilir(book.sure)}</span>
        </div>
        <p className="text-xs font-semibold text-teal-400">{formatFiyat(book.ucret)}</p>

        {showProgress && progressSaniye > 0 && (
          <div className="mt-2">
            <div className="h-1 bg-surface-base rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${progressYuzde}%` }} />
            </div>
            <p className="text-xs text-text-tertiary mt-1">%{Math.round(progressYuzde)} tamamlandı</p>
          </div>
        )}
      </div>
    </div>
  )
}
