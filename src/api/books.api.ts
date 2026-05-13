import type { Kitap, KitapListParams, DinlemeGecmisi, Degerlendirme } from '../types/book.types'
import type { ApiResponse, PaginatedResponse } from '../types/api.types'
import { apiClient } from './client'

export const booksApi = {
  getAll: (params: KitapListParams) =>
    apiClient.get<PaginatedResponse<Kitap>>('/books', { params }),

  getById: (id: number) => apiClient.get<ApiResponse<Kitap>>(`/books/${id}`),

  getHistory: () => apiClient.get<ApiResponse<DinlemeGecmisi[]>>('/books/history'),

  getFavorites: () => apiClient.get<ApiResponse<Kitap[]>>('/books/favorites'),

  addFavorite: (kitapId: number) =>
    apiClient.post<ApiResponse<null>>(`/books/${kitapId}/favorite`),

  removeFavorite: (kitapId: number) =>
    apiClient.delete<ApiResponse<null>>(`/books/${kitapId}/favorite`),

  getReviews: (kitapId: number) =>
    apiClient.get<ApiResponse<Degerlendirme[]>>(`/books/${kitapId}/reviews`),

  addReview: (kitapId: number, data: { puan: number; yorum?: string }) =>
    apiClient.post<ApiResponse<Degerlendirme>>(`/books/${kitapId}/reviews`, data),

  saveProgress: (kitapId: number, ilerleme: number) =>
    apiClient.put<ApiResponse<null>>(`/books/${kitapId}/progress`, { ilerleme }),
}
