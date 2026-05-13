import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { booksApi } from '@/api/books.api'
import type { KitapListParams } from '@/types/book.types'

export function useBooks(params: KitapListParams = {}) {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => booksApi.getAll(params).then((r) => r.data),
  })
}

export function useBook(id: number) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  })
}

export function useBookHistory() {
  return useQuery({
    queryKey: ['book-history'],
    queryFn: () => booksApi.getHistory().then((r) => r.data.data),
  })
}

export function useFavorites() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['favorites'],
    queryFn: () => booksApi.getFavorites().then((r) => r.data.data),
  })

  const addFavorite = useMutation({
    mutationFn: (kitapId: number) => booksApi.addFavorite(kitapId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  })

  const removeFavorite = useMutation({
    mutationFn: (kitapId: number) => booksApi.removeFavorite(kitapId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  })

  return { ...query, addFavorite: addFavorite.mutate, removeFavorite: removeFavorite.mutate }
}

export function useBookReviews(kitapId: number) {
  return useQuery({
    queryKey: ['reviews', kitapId],
    queryFn: () => booksApi.getReviews(kitapId).then((r) => r.data.data),
    enabled: !!kitapId,
  })
}
