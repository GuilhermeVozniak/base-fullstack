export interface ApiErrorResponse {
  message: string
  code?: string
  requestId?: string
}

export interface ApiSuccessResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
