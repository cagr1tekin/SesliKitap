import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Kitap } from '@/types/book.types'
import { BookCard } from './BookCard'

interface BookCarouselProps {
  title: string
  books: Kitap[]
  onPlay: (book: Kitap) => void
  seeAllHref?: string
}

export function BookCarousel({ title, books, onPlay, seeAllHref }: BookCarouselProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        {seeAllHref && (
          <Link
            to={seeAllHref}
            className="flex items-center gap-1 text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
          >
            Tümü
            <ChevronRight size={16} strokeWidth={1.75} />
          </Link>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onPlay={onPlay}
            className="shrink-0 w-36 md:w-44"
          />
        ))}
      </div>
    </section>
  )
}
