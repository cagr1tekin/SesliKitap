export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  nextCursor: string | null
  total: number
  hasMore: boolean
}

export interface ApiError {
  message: string
  code?: string
  statusCode: number
}
