import { Play, Star, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Kitap } from '@/types/book.types'
import { formatSureOkunabilir } from '@/utils/formatters'
import { Chip } from '@/components/ui/Chip'

interface BookRowProps {
  book: Kitap
  onPlay: (book: Kitap) => void
  progressSaniye?: number
}

export function BookRow({ book, onPlay, progressSaniye }: BookRowProps) {
  const progressYuzde = book.sure > 0 && progressSaniye
    ? Math.min(100, (progressSaniye / book.sure) * 100)
    : 0

  return (
    <div className="flex gap-4 bg-surface-raised rounded-2xl p-4 hover:bg-surface-overlay transition-colors">
      <div className="w-16 h-20 rounded-xl bg-surface-sunken shrink-0 flex items-center justify-center">
        <span className="text-text-tertiary text-xs text-center px-1 line-clamp-3">{book.baslik}</span>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/kitap/${book.id}`}>
              <h3 className="text-sm font-semibold text-text-primary truncate hover:text-teal-400 transition-colors">
                {book.baslik}
              </h3>
            </Link>
            <p className="text-xs text-text-secondary">
              {book.yazar.ad} {book.yazar.soyad}
            </p>
          </div>
          <button
            onClick={() => onPlay(book)}
            aria-label={`${book.baslik} kitabını oynat`}
            className="shrink-0 w-10 h-10 rounded-full bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <Play size={16} strokeWidth={1.75} className="ml-0.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <div className="flex items-center gap-1">
            <Star size={12} strokeWidth={1.75} className="text-yellow-400 fill-yellow-400" />
            {Number(book.ortalamaPuan).toFixed(1)}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} strokeWidth={1.75} />
            {formatSureOkunabilir(book.sure)}
          </div>
        </div>

        <Chip className="w-fit">{book.kategori.kategoriAdi}</Chip>

        {progressYuzde > 0 && (
          <div className="mt-1">
            <div className="h-1 bg-surface-base rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${progressYuzde}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
