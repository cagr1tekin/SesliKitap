import { useNavigate } from 'react-router-dom'
import { useBookHistory } from '@/hooks/useBooks'
import { usePlayer } from '@/hooks/usePlayer'
import { useAuthStore } from '@/store/authStore'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BookRow } from '@/components/book/BookRow'
import { EmptyState } from '@/components/ui/EmptyState'

export function HistoryPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { data: gecmis, isLoading } = useBookHistory()
  const { play } = usePlayer()

  if (!isAuthenticated) {
    navigate('/giris')
    return null
  }

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Dinleme Geçmişi</h1>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-surface-raised rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !gecmis?.length ? (
        <EmptyState
          title="Henüz kitap dinlemediniz"
          description="Katalogdan bir kitap seçerek dinlemeye başlayın."
          action={{ label: 'Kataloğa Git', onClick: () => navigate('/katalog') }}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {gecmis.map((item) => (
            <BookRow
              key={item.id}
              book={item.kitap}
              onPlay={play}
              progressSaniye={item.kalinanSaniye}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
